"use client";

import { useEffect, useState } from "react";

export default function MemoriesAdmin() {
    const [images, setImages] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);

    const fetchImages = async () => {
        const res = await fetch("/api/memories");
        const data = await res.json();
        setImages(data);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        await fetch("/api/admin/memories", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
            },
            body: formData,
        });

        setFile(null);
        fetchImages();
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl mb-4">Memories Upload</h1>

            {/* Upload */}
            <div className="mb-6">
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button
                    onClick={handleUpload}
                    className="ml-2 px-4 py-2 bg-black text-white rounded"
                >
                    Upload
                </button>
            </div>

            {/* Table */}
            <table className="w-full border">
                <thead>
                    <tr>
                        <th>Preview</th>
                        <th>Image Name</th>
                        <th>URL</th>
                    </tr>
                </thead>
                <tbody>
                    {images.map((img) => (
                        <tr key={img.id} className="border">
                            <td>
                                <img
                                    src={img.image_url}
                                    className="w-24 h-24 object-cover"
                                />
                            </td>
                            <td>{img.image_name}</td>
                            <td>{img.image_url}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}