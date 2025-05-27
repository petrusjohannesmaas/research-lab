# Client-Side Development

The client side refers to everything that users interact with directly in their web browser or application. It involves:

- UI/UX Design: Creating a visually appealing and user-friendly interface.
- Frontend Technologies: Typically built with HTML, CSS, and JavaScript (or frameworks like React, Vue, or Angular).
- Handling Requests: Sending requests to the backend, usually via APIs.
- Local State Management: Managing data in the browser, sometimes using Redux, React State, or Context API.


## Example: React App

I'll use Bulma's automatic theme adaptation since it leverages system settings, but adding a manual theme toggle allows users to override and control it themselves.

Here’s how we can structure it:
1. **Navbar with Theme Toggle:** A button in the navbar to **manually override** the system theme.
2. **Random Object Fetching:** Fetch a **random product** from DummyJSON every time the page loads.
3. **Loop-Based Random ID Selection:** Generate a random number between **1 and 9** on each page refresh.

---

### **Step 1: Navbar with Theme Toggle**
We’ll store the theme in **localStorage** to make it persist across page reloads.

```jsx
import React, { useState, useEffect } from "react";

function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme); // Applying theme globally
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <nav className="navbar is-primary">
      <div className="navbar-brand">
        <h1 className="navbar-item">Theme Toggle</h1>
      </div>
      <div className="navbar-end">
        <button className="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
```
- Clicking the button switches between **light/dark** mode.
- The theme persists across page refreshes.

---

### **Step 2: Fetching a Random Object on Page Load**
We’ll select a **random product** from DummyJSON using a loop.

```jsx
import React, { useState, useEffect } from "react";

function RandomProduct() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const randomId = Math.floor(Math.random() * 9) + 1; // Generates ID between 1 and 9
    fetch(`https://dummyjson.com/products/${randomId}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error fetching product:", err));
  }, []);

  return (
    <div>
      {product ? (
        <div>
          <h3>{product.title}</h3>
          <p>{product.description}</p>
          <img src={product.thumbnail} alt={product.title} width="150" />
        </div>
      ) : (
        <p>Loading product...</p>
      )}
    </div>
  );
}

export default RandomProduct;
```
- Generates a **random ID** between **1 and 9** on every page load.
- Fetches **data** from DummyJSON and **displays** it dynamically.

---

### **Step 3: Bringing Everything Together in `App.js`**
We now put **Navbar + RandomProduct** into the main App component.

```jsx
import React from "react";
import Navbar from "./Navbar";
import RandomProduct from "./RandomProduct";

function App() {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <RandomProduct />
      </div>
    </div>
  );
}

export default App;
```

---

### **Next Enhancements**
- Want smoother theme transitions? Use **CSS animations**.
- Want custom styling? Override **Bulma variables** for dark/light themes.
- Want user-selected product fetching? Let users **pick a number** instead of it being random.