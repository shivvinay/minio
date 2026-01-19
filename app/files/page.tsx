"use client";
import { useEffect, useState } from "react";

type Song = {
  _id: string;
  name: string;
  url?: string;
  mimeType?: string;
  size?: number;
};

export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    fetch("/api/craete-db")
      .then(res => res.json())
      .then(data => setSongs(data.songs || []))
      .catch(console.error);
  }, []);

  const renderPreview = (song: Song) => {
    if (!song.url || !song.mimeType) {
      return <p className="text-gray-400">No preview available</p>;
    }

    // 🖼 Image
    if (song.mimeType.startsWith("image/")) {
      return (
        <img
          src={song.url}
          alt={song.name}
          className="w-64 rounded-md border"
        />
      );
    }

    // 🎥 Video
    if (song.mimeType.startsWith("video/")) {
      return (
        <video
          controls
          className="w-64 rounded-md border"
        >
          <source src={song.url} type={song.mimeType} />
        </video>
      );
    }

    // 🔊 Audio
    if (song.mimeType.startsWith("audio/")) {
      return (
        <audio controls className="w-64">
          <source src={song.url} type={song.mimeType} />
        </audio>
      );
    }

    // 📄 Other files
    return (
      <a
        href={song.url}
        target="_blank"
        className="text-blue-500 underline"
      >
        Open file
      </a>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Uploaded Files</h2>

      <ul className="space-y-6">
        {songs.map(song => (
          <li key={song._id} className="border p-4 rounded-md">
            <p className="font-semibold">{song.name}</p>

            <div className="my-2">
              {renderPreview(song)}
            </div>

            <p>Type: {song.mimeType || "Unknown"}</p>
            <p>Size: {song.size ? `${song.size} bytes` : "Unknown"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
