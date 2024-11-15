"use client";
import React from "react";
import NotificationComponent from "../../components/NotificationComponent";

export default function NotificationPage() {

    const res = localStorage.getItem('loginResponse');
    console.log('response from local storage: ', res);
    return (
        <div>
            <span className="container mx-auto text-blue-600 font-semibold">This is notification showing page</span>
            <NotificationComponent user={'sayem'} />
        </div>
    );
}
