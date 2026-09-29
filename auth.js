import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
// Подключаем саму библиотеку через глобальный модуль
import { createClient } from 'https://jsdelivr.net';

// Создаем подключение к базе данных
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Функция регистрации игрока
export async function signUpUser(username, password) {
    if (!username || !password) {
        return { success: false, message: "Error: Please fill in all fields." };
    }
    if (password.length < 6) {
        return { success: false, message: "Error: Password must be at least 6 characters." };
    }

    // Твой хитрый план: переделываем ник в скрытую почту
    const generatedEmail = `${username}@supabase.com`;

    try {
        const { data, error } = await supabase.auth.signUp({
            email: generatedEmail,
            password: password,
            options: {
                data: { display_name: username }
            }
        });

        if (error) {
            return { success: false, message: "Error: " + error.message };
        } else {
            return { success: true, username: username };
        }
    } catch (err) {
        return { success: false, message: "System Error: " + err.message };
    }
}

// Функция восстановления аккаунта для тех, кого взломали
export async function recoverUser(username) {
    if (!username) return { success: false, message: "Error: Username required." };

    const generatedEmail = `${username.trim()}@supabase.com`;

    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(generatedEmail);
        if (error) {
            return { success: false, message: "Error: " + error.message };
        } else {
            return { success: true, message: "Success! Recovery code sent to " + username + "@supabase.com" };
        }
    } catch (err) {
        return { success: false, message: "System Error: " + err.message };
    }
}
