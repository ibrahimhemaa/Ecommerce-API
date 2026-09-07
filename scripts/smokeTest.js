const BASE = "http://localhost:5000/api";

let results = [];
const test = (name, ok, extra = "") =>
  results.push(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  -> " + extra : ""}`);

const req = async (method, path, { token, body, multipart } = {}) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (multipart) {
    payload = new FormData();
    for (const [k, v] of Object.entries(multipart)) if (v !== "") payload.append(k, v);
  } else {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${path}`, { method, headers, body: payload });
  let data = null;
  try { data = await res.json(); } catch {}
  return { status: res.status, data };
};

const login = await req("POST", "/auth/login", { body: { email: process.env.TEST_ADMIN_EMAIL || "test@gmail.com", password: process.env.TEST_ADMIN_PASSWORD || "secret123" } });
test("login as admin", login.status === 200, `role=${login.data?.user?.role}`);
const adminToken = login.data?.token;

const cats = await req("GET", "/categories", { token: adminToken });
const catId = cats.data?.data?.[0]?._id || cats.data?.data?.[0]?.id;
test("GET categories (admin token)", cats.status === 200, `catId=${catId}`);
const brs = await req("GET", "/brands");
const brandId = brs.data?.data?.[0]?._id || brs.data?.data?.[0]?.id;
test("GET brands", brs.status === 200, `brandId=${brandId}`);

if (catId && brandId) {
  const prod = await req("POST", "/products", {
    token: adminToken,
    body: {
      title: "Galaxy S25 Test",
      description: "Latest galaxy flagship phone",
      quantity: 20,
      price: 3420,
      priceAfterDiscount: 3000,
      category: catId,
      brand: brandId,
    },
  });
  test("create product (JSON)", prod.status === 201, prod.data?.data?._id || prod.data?.message);
  const productId = prod.data?.data?._id;
  test("product created id present", !!productId);

  if (productId) {
    const got = await req("GET", `/products/${productId}`);
    test("get product by id", got.status === 200);

    const search = await req("GET", "/products?keyword=Galaxy");
    test("search products keyword", search.status === 200);

    // 4. Review (needs user token). Use a normal user
    const ul = await req("POST", "/auth/login", { body: { email: process.env.TEST_USER_EMAIL || "user@gmail.com", password: process.env.TEST_USER_PASSWORD || "secret123" } });
    test("login as normal user", ul.status === 200, `role=${ul.data?.user?.role}`);
    const userToken = ul.data?.token;

    if (userToken) {
      const rev = await req("POST", "/reviews", {
        token: userToken,
        body: { title: "Great", ratings: 4, product: productId },
      });
      test("create review", rev.status === 201 || rev.status === 200);

      const wish = await req("POST", "/wishlist", { token: userToken, body: { productId } });
      test("add to wishlist", wish.status === 200, wish.data?.message);

      const cart = await req("POST", "/cart", { token: userToken, body: { productId, quantity: 2 } });
      test("add to cart", cart.status === 200);

      const getCart = await req("GET", "/cart", { token: userToken });
      test("get cart", getCart.status === 200);
      if (getCart.data?.data?.totalCartPrice)
        test("cart total printed", true, `total=${getCart.data.data.totalCartPrice}`);

      if (getCart.data?.data?._id) {
        const order = await req("POST", "/orders", {
          token: userToken,
          body: {
            shippingAddress: { details: "123 Main St", phone: "01012345678", city: "Cairo" },
          },
        });
        test("create cash order", order.status === 201 || order.status === 200);

        const orders = await req("GET", "/orders", { token: userToken });
        test("get my orders", orders.status === 200);
      }
    }

    const coupon = await req("POST", "/coupons", {
      token: adminToken,
      body: { name: "SAVE10X", discount: 10, expire: "2026-12-31" },
    });
    test("create coupon (admin)", coupon.status === 201 || coupon.status === 200);

    const users = await req("GET", "/users", { token: adminToken });
    test("get users (admin)", users.status === 200);

    const me = await req("GET", "/users/getMe", { token: adminToken });
    test("getMe", me.status === 200);
  }
}

console.log("\n================ SMOKE TEST RESULTS ================\n");
results.forEach((r) => console.log(r));
console.log(`\n${results.filter((r) => r.startsWith("PASS")).length}/${results.length} passed`);
process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);