import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {privateRoutes, publicRoutes, routeNames} from "../routes";
import {useTypedSelector} from "../hooks/useTypedSelector";

const AppRouter = () => {

    const isAuth = useTypedSelector(state => state.auth.isAuth)

    return (
        isAuth ?
            <Routes>
                {privateRoutes.map(route =>
                    <Route
                        path={route.path}
                        element={<route.element/>}
                        key={route.path}
                    />
                )}
                <Route path="/*" element={<Navigate replace to={routeNames.REGISTRY}/>}/>
            </Routes>
            :
            <Routes>
                {publicRoutes.map(route =>
                    <Route
                        path={route.path}
                        element={<route.element/>}
                        key={route.path}
                    />
                )}
                <Route path="/*" element={<Navigate replace to={routeNames.MAIN}/>}/>
            </Routes>
    );
};

export default AppRouter;