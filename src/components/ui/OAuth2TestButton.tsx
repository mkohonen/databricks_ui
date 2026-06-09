"use client";

import { useState } from "react";

export default function OAuth2TestButton() {
    const [token, setToken] = useState<string | null>(null);

    const haeTestiToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", "databricks-ui");
    params.append("scope", "openid");
    
    // TÄMÄ ON RATKAISU: claims-parametri pitää lähettää x-www-form-urlencoded muodossa,
    // ja sen sisällön on oltava JSON-merkkijono, jonka avain on "claims" (ei custom_claims)
    const tokenClaims = {
      realm_access: {
        roles: ["USER_ROLE"]
      }
    };
    params.append("claims", JSON.stringify(tokenClaims));

    const res = await fetch("http://localhost:9000/token", {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded" 
      },
      body: params,
    });

    if (!res.ok) throw new Error("Tokenin haku epäonnistui");

    const data = await res.json();
    setToken(data.access_token);
    console.log("Uusi ROOLITETTU JWT Testitoken:", data.access_token);
    alert("Uusi roolitettu token ladattu onnistuneesti!");
  } catch (error) {
    console.error("Virhe tokenia hakiessa:", error);
  }
};


    return (
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg font-bold mb-2">OAuth2 Testityökalu</h3>
            <button
                onClick={haeTestiToken}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Hae voimassa oleva OAuth2 JWT-token
            </button>

            {token && (
                <div className="mt-4">
                    <p className="text-sm font-semibold">Nykyinen token ajossa:</p>
                    <textarea
                        readOnly
                        value={token}
                        className="w-full h-24 p-2 text-xs font-mono border rounded mt-1 bg-white dark:bg-black"
                    />
                </div>
            )}
        </div>
    );
}
