import { useEffect, useState } from "react"
import { getSessionQuery } from "../helpers/queries/session-queries"
import { UAParser } from "ua-parser-js";
import { Session } from "../helpers/types/Session";

const SettingsSecurity = () => {
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        getSessionQuery().then(res => {
            console.log(res)
            const processed = res.data.map((s: Session) => {
                const parser = new UAParser(s.userAgent);
                return {
                    ...s,
                    browser: parser.getBrowser().name + " " + parser.getBrowser().version,
                    os: parser.getOS().name + " " + parser.getOS().version,
                    ipAddress: s.ipAddress === "0:0:0:0:0:0:0:1" ? "Localhost" : s.ipAddress,
                    tokenDate: new Date(s.tokenDate).toLocaleString("hu-HU")
                };
            });
            setSessions(processed);
        });
    }, []);

    return (
        <div className="w-full h-full p-5">
            <h1 className="text-2xl font-semibold mb-4">Aktív bejelentkezések</h1>

            {sessions.length === 0 ? (
                <p className="text-gray-500">Nincsenek aktív sessionök.</p>
            ) : (
                <div className="space-y-3">
                    {sessions.map((s, i) => (
                        <div key={i} className="p-4 border rounded-lg shadow-sm">
                            <p><strong>IP:</strong> {s.ipAddress}</p>
                            <p><strong>Böngésző:</strong> {s.browser}</p>
                            <p><strong>OS:</strong> {s.os}</p>
                            <p><strong>Bejelentkezés ideje:</strong> {s.tokenDate}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SettingsSecurity
