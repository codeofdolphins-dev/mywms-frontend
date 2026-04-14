import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Login from './screens/auth/Login';
import Master from './screens/master/Master';
import Error404 from './screens/Error404';
import Browse from './screens/Browse';
import CreateRequisition from './screens/requisition/CreateRequisition';
import HSN from './screens/master/hsn/HSN';
import Rules from './screens/admin/Rules';
import Inward from './screens/inward/Inward';
import CreateInward from './screens/inward/CreateInward';
import Requisition from './screens/requisition/Requisition';
import AppLayout from './layouts/App.layout';
import AuthLayout from './layouts/Auth.layout';
import Permission from './screens/access/Permission';
import Role from './screens/access/Role';
import AssignRole from './screens/access/AssignRole';
import Quotation from './screens/quotation/Quotation';
import ReceiveQuotation from './screens/quotation/ReceiveQuotation';
import ReceiveRequision from './screens/requisition/ReceiveRequision';
import CreateUser from './screens/user/CreateUser';
import UserBrowse from './screens/user/UserBrowse';
import UserProfile from './screens/user/UserProfile';
import Category from './screens/master/category/Category';
import Brand from './screens/master/brand/Brand';
import Supplier from './screens/master/supplier/Supplier';
import Product from './screens/master/product/Product';
import AddProduct from './screens/master/product/AddProduct';
import PackageType from './screens/master/packageType/PackageType';
import UnitType from './screens/master/unitType/UnitType';
import Register from './screens/auth/Register';
import Admin from './screens/admin/Admin';
import SuperAdmin from './screens/superAdmin/SuperAdmin';
import Vendor from './screens/vendor/Vendor';
import VendorCategory from './screens/vendor/VendorCategory';
import BlanketPO from './screens/order/BlanketPO';
import BPODetailsPage from './screens/order/BPODetailsPage';
import Store from './screens/admin/store/Store';
import OrderBrowse from './screens/order/OrderBrowse';
import OrderDetails from './screens/order/OrderDetails';
import Test from './screens/CreateInward';
import Outward from './screens/outward/Outward';
import OutwardDetails from './screens/outward/OutwardDetails';
import Inventory from './screens/inventory/Inventory';
import OpenForum from './screens/OpenForum';
import RegisterLocation from './screens/admin/locations/RegisterLocation';
import Location from './screens/admin/locations/Location';


function App() {

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                {/* auth */}
                <Route path="auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>

                {/* app */}
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<OpenForum />} />

                    {/* super admin */}
                    <Route path="super-admin" >
                        <Route path="browse" element={<SuperAdmin />} />
                        <Route path="business-flow" element={<Rules />} />
                    </Route>


                    {/* admin */}
                    <Route path="admin" >
                        {/* location */}
                        <Route path="location" >
                            <Route index element={<Location />} />
                            <Route path="register" element={<RegisterLocation />} />
                        </Route>

                        {/* store */}
                        <Route path="store" >
                            <Route index element={<Store />} />
                        </Route>

                        {/* user */}
                        <Route path="user" >
                            <Route index element={<UserBrowse />} />
                            <Route path="register" element={<CreateUser />} />
                            <Route path="update/:id" element={<CreateUser />} />
                            <Route path="profile/:id" element={<UserProfile />} />
                        </Route>

                        {/* inventory */}
                        <Route path="inventory" >
                            <Route index element={<Inventory />} />
                        </Route>
                    </Route>


                    {/* master */}
                    <Route path='master'>
                        <Route index element={<Master />} />
                        <Route path="categories" element={<Category />} />
                        <Route path="brands" element={<Brand />} />
                        <Route path="suppliers" element={<Supplier />} />
                        {/* <Route path="suppliers/add-supplier" element={<AddSupplier />} /> */}
                        {/* <Route path="suppliers/add-supplier" element={<SupplierForm />} /> */}
                        <Route path="hsncodes" element={<HSN />} />
                        <Route path="products" element={<Product />} />
                        <Route path="products/add-product" element={<AddProduct />} />
                        <Route path="products/edit-product/:id" element={<AddProduct />} />
                        <Route path="unit-types" element={<UnitType />} />
                        <Route path="package-types" element={<PackageType />} />
                    </Route>

                    {/* access */}
                    <Route path="access" >
                        <Route path="role" element={<Role />} />
                        <Route path="role/create" element={<Master />} />
                        <Route path="role/assign/:id" element={<AssignRole />} />
                        <Route path="permission" element={<Permission />} />
                        <Route path="permission/create" element={<Master />} />
                    </Route>


                    {/* requisition */}
                    <Route path="requisition" >
                        <Route index element={<Requisition />} />
                        <Route path="create" element={<CreateRequisition />} />
                        <Route path="received-requisition" element={<ReceiveRequision />} />
                    </Route>


                    {/* quotation */}
                    <Route path="quotation" >
                        <Route index element={<Quotation />} />
                        <Route path="received-quotation" element={<ReceiveQuotation />} />
                    </Route>


                    {/* order */}
                    <Route path="order" >
                        <Route index element={<OrderBrowse />} />
                        <Route path='bpo' element={<BlanketPO />} />
                        <Route path='bpo/details/:id' element={<BPODetailsPage />} />
                        <Route path=':id' element={<OrderDetails />} />
                    </Route>


                    {/* production */}
                    <Route path="production" >
                        <Route path='vendor' element={<Vendor />} />
                        <Route path='vendor/category' element={<VendorCategory />} />
                    </Route>


                    {/* supplier */}
                    <Route path="supplier" >
                        <Route path="" element={<Browse
                            pageName="Suppliers"
                        />} />
                    </Route>

                    {/* inward */}
                    <Route path="inward" >
                        <Route index element={<Inward />} />
                        <Route path="create" element={<CreateInward />} />
                    </Route>





                    {/* outward */}
                    <Route path="outward" >
                        <Route index element={<Outward />} />
                        <Route path=':out_no' element={<OutwardDetails />} />
                    </Route>
                </Route>





                <Route path="/test" element={<Test />} />

                <Route path="*" element={<Error404 />} />
                {/* <Route path="*" element={<Select />} /> */}
            </Route>
        )
    )


    return <>
        <div className="horizontal full main-section antialiased relative font-nunito text-sm font-normal">
            <RouterProvider router={router} />
        </div>
    </>
}

export default App
