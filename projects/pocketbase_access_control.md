# **Access Control Rules in PocketBase**
When building an application with **PocketBase**, it's essential to set up **proper access rules** to ensure users can only manipulate their own records. This guide covers **CRUD operations (Create, Read, Update, Delete), Listing/Search rules, and Authentication requirements**.

---

## **1. Authentication Setup**
- Users must be **authenticated** to interact with the system.
- Enable **email/password authentication** or OAuth in PocketBase.
- Store the user’s **session token** for authorization.

### **Fetching Logged-in User ID**
Ensure the user ID is available for linking records:
```js
const userId = localStorage.getItem("pb_user_id");
```

---

## **2. CRUD Rules (Restrict Users to Their Own Data)**
Each record in a collection should be **linked to the authenticated user**. In PocketBase, you can enforce this with rules.

### **Create Rule (Restrict to Authenticated Users)**
Only allow **authenticated users** to create records:
```json
@request.auth.id != ""
```
**Outcome:** Anonymous users **cannot** create records.

### **Read Rule (Only Own Records)**
Prevent users from **reading others' records**:
```json
@request.auth.id = @collection.<collection_name>.user
```
**Outcome:** Users can **only access** their own records.

### **Update Rule (Only Own Records)**
Users **must own** the record to edit it:
```json
@request.auth.id = @collection.<collection_name>.user
```
**Outcome:** Users **cannot modify** others' data.

### **Delete Rule (Only Own Records)**
Only allow users to **delete their own records**:
```json
@request.auth.id = @collection.<collection_name>.user
```
**Outcome:** Users **cannot delete** records that belong to others.

---

## **3. Listing/Search Rule (Restrict Query Results)**
To **limit listing results** to only **the logged-in user’s data**, apply this rule:
```json
@request.auth.id = @collection.<collection_name>.user
```
**Outcome:** Users **cannot search/list other users' records**.

### **Example API Request (Fetching Own Records)**
```js
const token = localStorage.getItem("pb_token");

const res = await fetch('/api/<collection_name>', {
    method: 'GET',
    headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
    }
});

const records = await res.json();
console.log(records); // Only shows authenticated user's records
```

---

## **4. Linking Records to Users**
Each record should have a **user reference field** (e.g., `user` or `owner`). When creating a record, ensure it's linked to the **logged-in user**:
```js
const data = {
    field1: "Some data",
    field2: "More data",
    user: userId // Associate record with user
};
```

---

## **Conclusion**
By implementing **authentication** and enforcing **CRUD rules**, you can secure your **PocketBase application** and ensure users can only **manage their own data**. This method enhances privacy and prevents unauthorized access.
