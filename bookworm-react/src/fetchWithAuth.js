export async function fetchWithAuth(url, options = {}) {
    let accessToken = localStorage.getItem("access_token");
    options.headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
    };
    options.credentials = "include"; // Để gửi cookie refresh_token

    let response = await fetch(url, options);

    if (response.status === 401) {
        // Token hết hạn, gọi refresh
        const refreshRes = await fetch("http://127.0.0.1:8002/refresh-token", {
            method: "POST",
            credentials: "include",
        });
        if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem("access_token", data.access_token);
            // Retry request với token mới
            options.headers.Authorization = `Bearer ${data.access_token}`;
            response = await fetch(url, options);
        } else {
            // Nếu refresh cũng lỗi, xóa thông tin và chuyển về login
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("full_name");
            window.location.href = "/"; // hoặc trang login
            throw new Error("Session expired. Please login again.");
        }
    }
    return response;
}
