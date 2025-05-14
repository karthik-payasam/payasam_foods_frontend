import { createContext, useContext, useState } from "react"


const UseContextData = createContext()
export const useAuthContext = () => useContext(UseContextData);
export const AuthContextProvider = ({ children }) => {
    const [login, setLogin] = useState(false)
    const [role, setRole] = useState(0)
    const [userData, setUserData] = useState(null)
    const [verifyCondition, setVerifyCondition] = useState(false);

    return < UseContextData.Provider value={{ role, setRole, login, setLogin, userData, setUserData, verifyCondition, setVerifyCondition }} >
        {children}
    </UseContextData.Provider >
}
