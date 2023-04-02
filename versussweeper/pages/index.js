import db from "../firebase/clientApp";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Header from "../components/Header";

export default function Home() {
  

    return (
        <div>
            <Header />

            <br />

            <h2>Home</h2>  
        </div>
    )
}
