import {UrlEnum} from "../constants/urlEnum";

const getToken = () => {
    const auth = localStorage.getItem("accessToken");
    if (auth !== null) {
        return {"Authorization": "Bearer " + auth, "Content-Type": "application/json"}
    } else {
        return {"Authorization": "", "Content-Type": "application/json"};
    }
}

interface OptionsValues {
    url?: string;
    body?: string;
    method?: string;
    params?: any;
}

let test: any;

export const inDispatch = (testIn: any) => {
    test = testIn;
}

export async function Request(options: OptionsValues) {
    try {
        const response = await fetch(UrlEnum.Server + UrlEnum.VerApi + options.url + '/?' + new URLSearchParams(options.params).toString(), {
            body: options.body,
            method: options.method,
            headers: getToken()
        });

        const json = await response.json();

        if (!response.ok) {
            throw (json);
        }

        return {
            isOk: true,
            data: json
        };
    } catch (e: any) {
        if (e.status === "UNAUTHORIZED") {
            return checkAuth(options)
                .then((response: any) => {
                    return {
                        isOk: true,
                        data: response
                    };
                })
        } else {
            return {
                isOk: false,
                data: e.message
            };
        }
    }
}

export async function RequestPDF(options: OptionsValues) {
    try {
        const response = await fetch(UrlEnum.Server + UrlEnum.VerApi + options.url + '/?' + new URLSearchParams(options.params).toString(), {
            body: options.body,
            method: options.method,
            headers: getToken(),
        });

        const json = await response.blob();

        if (!response.ok) {
            throw (json);
        }

        return {
            isOk: true,
            data: json
        };
    } catch (e: any) {
        if (e.status === "UNAUTHORIZED") {
            return checkAuth(options)
                .then((response: any) => {
                    return {
                        isOk: true,
                        data: response
                    };
                })
        } else {
            return {
                isOk: false,
                data: e.message
            };
        }
    }
}

export const checkAuth = async (options: OptionsValues) => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
        const response = await fetch(UrlEnum.Server + UrlEnum.VerApi + "/auth/refresh-tokens", {
            body: JSON.stringify({"refreshToken": refreshToken}),
            method: "POST",
            headers: {"Content-Type": "application/json"}
        });

        const json = await response.json();

        if (!response.ok) {
            throw (json);
        }

        localStorage.setItem("accessToken", json.accessToken);
        localStorage.setItem("refreshToken", json.refreshToken);
        if (options.url !== undefined) {
            const response = await fetch(UrlEnum.Server + UrlEnum.VerApi + options.url, {
                body: options.body,
                method: options.method,
                headers: getToken()
            })
            return await response.json();
        }
    } catch (e: any) {
        test();
        // localStorage.removeItem('isAuth')
        // localStorage.removeItem('accessToken')
        // localStorage.removeItem('refreshToken')
        // if (options.dispatch) {
        //     options.dispatch({type: AuthType.FETCH_AUTH_SET_LOGOUT})
        // }
        return {
            isOk: false,
            data: {}
        };
    }
}