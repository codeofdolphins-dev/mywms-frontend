import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import AuthLayout from './layouts/Auth.layout'
import Login from './screens/auth/Login'
import Register from './screens/auth/Register'
import Dashboard from './screens/Dashboard'
import AppLayout from './layouts/App.layout'
import Master from './screens/Master'
import Error404 from './screens/Error404'
import RequisitionLayout from './layouts/Requisition.layout'
import Rules from './screens/requisition/Rules'
import Browse from './screens/Browse';
import SupplierLayout from './layouts/Supplier.layout'
import ProductionLayout from './layouts/Production.layout'
import StoreLayout from './layouts/StoreLayout'
import DealerLayout from './layouts/DealerLayout'
import RetailerLayout from './layouts/RetailerLayout'
import DistributorLayout from './layouts/DistributorLayout'
import WarehouseLayout from './layouts/WarehouseLayout'
import AccessLayout from './layouts/Access.layout'
import CreateRequisition from './screens/requisition/CreateRequisition'
import Category from './screens/category/Category'
import MasterLayout from './layouts/Master.layout'
import Brand from './screens/brand/Brand'
import Warehouse from './screens/warehouse/Warehouse'
import Supplier from './screens/supplier/Supplier'
import HSN from './screens/hsn/HSN'
import Product from './screens/product/Product'
import AddProduct from './screens/product/AddProduct'
import AddSupplier from './screens/supplier/AddSupplier'
import CreateHSN from './screens/hsn/CreateHSN'

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
                    <Route path="/" element={<Dashboard />} />
                    
                    {/* master */}
                    <Route path="master" element={<MasterLayout />} >
                        <Route path="" element={<Master />} />
                        <Route path="categories" element={<Category />} />
                        <Route path="brands" element={<Brand />} />
                        <Route path="warehouses" element={<Warehouse />} />
                        <Route path="suppliers" element={<Supplier />} />
                        <Route path="suppliers/add-supplier" element={<AddSupplier />} />
                        <Route path="hsncodes" element={<HSN />} />
                        <Route path="hsncodes/add-hsncode" element={<CreateHSN />} />
                        <Route path="products" element={<Product />} />
                        <Route path="products/add-product" element={<AddProduct />} />
                    </Route>

                    {/* access */}
                    <Route path="access" element={<AccessLayout />} >
                        <Route path="role" element={<Master />} />
                        <Route path="role/create" element={<Master />} />
                        <Route path="role/assign" element={<Master />} />
                        <Route path="permission" element={<Master />} />
                        <Route path="permission/create" element={<Master />} />
                        <Route path="permission/assign" element={<Master />} />
                    </Route>

                    {/* requisition */}
                    <Route path="requisition" element={<RequisitionLayout />} >
                        <Route path="admin/rules" element={<Rules />} />
                        <Route path="" element={<Browse
                            pageName="Requisitions"
                        />} />
                        <Route path="create" element={<CreateRequisition />} />
                    </Route>

                    {/* supplier */}
                    <Route path="supplier" element={<SupplierLayout />} >
                        <Route path="" element={<Browse
                            pageName="Suppliers"
                        />} />
                    </Route>

                    {/* production */}
                    <Route path="production" element={<ProductionLayout />} >
                        <Route path="" element={<Browse
                            pageName="Production"
                        />} />
                    </Route>

                    {/* store */}
                    <Route path="store" element={<StoreLayout />} >
                        <Route path="" element={<Browse
                            pageName="Store"
                        />} />
                    </Route>

                    {/* dealer */}
                    <Route path="dealer" element={<DealerLayout />} >
                        <Route path="" element={<Browse
                            pageName="Dealer"
                        />} />
                    </Route>

                    {/* retailer */}
                    <Route path="retailer" element={<RetailerLayout />} >
                        <Route path="" element={<Browse
                            pageName="Retailer"
                        />} />
                    </Route>

                    {/* distributor */}
                    <Route path="distributor" element={<DistributorLayout />} >
                        <Route path="" element={<Browse
                            pageName="Distributor"
                        />} />
                    </Route>

                    {/* warehouse */}
                    <Route path="warehouse" element={<WarehouseLayout />} >
                        <Route path="" element={<Browse
                            pageName="Warehouse"
                        />} />
                    </Route>

                </Route>
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
