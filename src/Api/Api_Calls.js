
export const ApiEndPoint = "http://localhost:9090"
const server = `${ApiEndPoint}/user/api`
const apiList = {
    login: `${server}/login`,
    registration: `${server}/Registration`,
    otp: `${server}/basedonEmailOtp`,
    resendOtp: `${server}/resendOtp`,
    categorySubCategoryData: `${server}/fetch/getCategoryAndSubCategories`,
    ProfileData: `${server}/ProfileData`,
    ordersData: `${server}/ordersData`,
    createOrder: `${server}/createOrder`,
    getCategoryDetails: `${server}/getCategoryDetails`,
    AllproductDetailsbyCategory: `${server}/fetch/AllproductDetailsbyCategory`,
    paymentDetails: `${server}/payment`,
    order_Details: `${server}/order_Details`,
    ProductData: `${server}/fetch/ProductData`,
    searchItems: `${server}/searchItems`,


}
export default apiList;