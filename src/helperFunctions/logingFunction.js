import axios from "axios";
import { apiRoot } from "./apiRoot";

const loginAuths = () => {
    axios
        .post(`${apiRoot.endpoint}/api/auth/demo-account`)
        .then((res) => {
            console.log("Login Auth Has been Invoked", res);
            if (res.status === 200) {
                const token = res.data.authorization;
                const userId = res.data.user_id;
                localStorage.setItem("userId", userId);
                localStorage.setItem("token", token);
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

export default loginAuths;