import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const loginUrl = "https://restapi.tu.ac.th/api/v1/auth/Ad/verify";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', async (req, res) => {

    if (process.env.TU_API_KEY === undefined) {
        console.error("Please set the TU_API_KEY environment variable");
        res.status(500).json({ message: "Internal Server Error" })
        return;
    }

    try {

        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "โปรดกรอกชื่อและรหัสผ่าน" })
        }
        const response = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Application-Key": process.env.TU_API_KEY
            },
            body: JSON.stringify({
                "UserName": username,
                "PassWord": password
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ message: errorData.Description || "เข้าสู่ระบบไม่สำเร็จ" });
        }

        if (response.status === 400) {
            return res.status(400).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" })
        };
        const result = await response.json()
        res.json(result)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://127.0.0.1:${PORT}`));
