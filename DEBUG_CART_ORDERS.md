# Debugging: Cart Items and Order Items Not Showing in Supabase

## Quick Diagnostic Steps

### Step 1: Check Browser Console
1. Open your website
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try adding an item to cart or placing an order
5. Look for error messages or logs

### Step 2: Verify You're Logged In
- Cart items and order items require authentication
- Make sure you're logged in as a user (not just viewing as guest)
- Check if `user` exists in the auth context

### Step 3: Check Supabase RLS Policies

Run this in Supabase SQL Editor to verify policies exist:

```sql
-- Check cart_items policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'cart_items';

-- Check order_items policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'order_items';
```

### Step 4: Test Direct Insert (For Debugging)

Run this in Supabase SQL Editor (replace with your user ID):

```sql
-- Get your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Test inserting a cart item (replace USER_ID and PRODUCT_ID)
INSERT INTO public.cart_items (user_id, product_id, quantity)
VALUES ('USER_ID_HERE', 'PRODUCT_ID_HERE', 1)
RETURNING *;
```

If this works, the issue is in the application code.
If this fails, the issue is with RLS policies or database setup.

### Step 5: Check Application Logs

The code now includes detailed console logging. When you:
- **Add to cart**: Look for "Adding new cart item:" and "Cart item added successfully"
- **Place order**: Look for "Creating order items:" and "Order items created"

### Step 6: Verify RLS is Working

Check if RLS is blocking inserts:

```sql
-- Temporarily check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('cart_items', 'order_items');
```

Both should show `rowsecurity = true`.

## Common Issues and Solutions

### Issue 1: "new row violates row-level security policy"
**Solution**: The user is not authenticated or RLS policies are too restrictive.
- Make sure you're logged in
- Verify the user_id matches `auth.uid()`

### Issue 2: "foreign key constraint violation"
**Solution**: The product_id doesn't exist in the products table.
- Verify the product exists: `SELECT * FROM products WHERE id = 'PRODUCT_ID';`

### Issue 3: "permission denied for table"
**Solution**: RLS policies might not be set up correctly.
- Run the migration files again
- Check if policies exist (see Step 3)

### Issue 4: Items appear in app but not in Supabase dashboard
**Solution**: You're viewing as a different user or RLS is hiding them.
- Use admin account to view all items
- Or query with your specific user_id

## Testing Checklist

- [ ] User is logged in
- [ ] Console shows "Adding new cart item:" log
- [ ] Console shows "Cart item added successfully" log
- [ ] No error messages in console
- [ ] Can see cart items in the app UI
- [ ] Can query cart_items table in Supabase (as admin or same user)
- [ ] RLS policies are enabled
- [ ] User has correct user_id

## Admin View All Items

If you're an admin, you can view all cart items and order items:

```sql
-- View all cart items (as admin)
SELECT ci.*, u.email as user_email, p.name as product_name
FROM cart_items ci
JOIN auth.users u ON u.id = ci.user_id
JOIN products p ON p.id = ci.product_id;

-- View all order items (as admin)
SELECT oi.*, o.user_id, u.email as user_email, p.name as product_name
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
JOIN auth.users u ON u.id = o.user_id
JOIN products p ON p.id = oi.product_id;
```

## Still Not Working?

1. **Check the exact error** in browser console
2. **Verify Supabase connection** - Check if other operations work
3. **Test with a simple insert** using the SQL above
4. **Check network tab** - See the actual API request/response
5. **Verify environment variables** - Make sure Supabase URL and keys are correct

