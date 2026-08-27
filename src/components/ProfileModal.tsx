import React, { useState } from "react";
import {
  User,
  Sparkles,
  Check,
  X,
  Disc,
  Headphones,
  Music,
  Share2,
  Copy,
  CheckCheck,
  Radio,
  Sliders,
  Globe,
  Tag,
  Plus
} from "lucide-react";
import { UserProfile, ListenerSegment } from "../types";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  currentSegment: ListenerSegment;
}

const AVATARS = [
  { id: "pulsar", label: "Pulsar Star", icon: "✨", color: "from-emerald-400 to-cyan-500" },
  { id: "nebula", label: "Violet Nebula", icon: "🌌", color: "from-purple-500 to-indigo-600" },
  { id: "solar", label: "Solar Flare", icon: "☀️", color: "from-amber-400 to-orange-500" },
  { id: "voyager", label: "Deep Voyager", icon: "🚀", color: "from-blue-400 to-teal-500" },
  { id: "orbit", label: "Celestial Ring", icon: "🪐", color: "from-emerald-500 to-teal-600" },
  { id: "supernova", label: "Supernova", icon: "💥", color: "from-rose-400 to-pink-600" }
];

const SUGGESTED_GENRES = [
  "Synthwave",
  "Dream Pop",
  "Ambient",
  "Shoegaze",
  "Post-Rock",
  "IDM",
  "Lo-Fi Beats",
  "Jazz Fusion",
  "Indie Rock",
  "Hyperpop",
  "Deep Techno",
  "Baroque Classical"
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  currentSegment
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [newGenreInput, setNewGenreInput] = useState<string>("");
  const [newArtistInput, setNewArtistInput] = useState<string>("");
  const [copiedBadge, setCopiedBadge] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAddGenre = (genre: string) => {
    const trimmed = genre.trim();
    if (!trimmed || formData.favoriteGenres.includes(trimmed)) return;
    setFormData((prev) => ({
      ...prev,
      favoriteGenres: [...prev.favoriteGenres, trimmed]
    }));
    setNewGenreInput("");
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.filter((g) => g !== genreToRemove)
    }));
  };

  const handleAddArtist = () => {
    const trimmed = newArtistInput.trim();
    if (!trimmed || formData.topArtists.includes(trimmed)) return;
    setFormData((prev) => ({
      ...prev,
      topArtists: [...prev.topArtists, trimmed]
    }));
    setNewArtistInput("");
  };

  const handleRemoveArtist = (artistToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      topArtists: prev.topArtists.filter((a) => a !== artistToRemove)
    }));
  };

  const handleSave = () => {
    onSaveProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 400);
  };

  const handleCopyPassport = () => {
    const text = `🎧 Audio Identity Passport: ${formData.name} (${formData.handle})
Segment: ${currentSegment}
Primary Streamer: ${formData.primaryService}
Top Genres: ${formData.favoriteGenres.join(", ")}
Top Artists: ${formData.topArtists.join(", ")}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedBadge(true);
      setTimeout(() => setCopiedBadge(false), 2000);
    });
  };

  const activeAvatar = AVATARS.find((a) => a.id === formData.avatarId) || AVATARS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="profile-modal"
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-100 my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Listener Identity Profile
            </h3>
            <p className="text-xs font-mono text-emerald-400">
              Customize Your Musical Persona & Streaming Preferences
            </p>
          </div>
        </div>

        {/* Passport Preview Bento Card */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800/90 shadow-xl mb-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeAvatar.color} flex items-center justify-center text-2xl shadow-lg shrink-0`}>
                {activeAvatar.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-white tracking-tight">
                    {formData.name || "Anonymous Listener"}
                  </h4>
                  <span className="text-xs font-mono text-slate-400">
                    {formData.handle || "@listener"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                    {currentSegment}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]">
                    {formData.primaryService}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyPassport}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Copy audio persona card summary"
            >
              {copiedBadge ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Share Card</span>
                </>
              )}
            </button>
          </div>

          {formData.bio && (
            <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-900 italic">
              "{formData.bio}"
            </p>
          )}
        </div>

        {/* Profile Edit Form */}
        <div className="space-y-5">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Select Avatar Archetype
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {AVATARS.map((av) => {
                const isSelected = formData.avatarId === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarId: av.id, avatarIcon: av.icon })}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? "bg-slate-800 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/40"
                        : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xl">{av.icon}</span>
                    <span className="text-[10px] font-mono text-slate-300 truncate w-full text-center">
                      {av.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Handle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Astral Seeker"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Listener Handle
              </label>
              <input
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                placeholder="e.g. @orbit_listener"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Primary Music Platform & Bio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Primary Streaming Service
              </label>
              <select
                value={formData.primaryService}
                onChange={(e) =>
                  setFormData({ ...formData, primaryService: e.target.value as any })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Spotify">Spotify</option>
                <option value="Apple Music">Apple Music</option>
                <option value="YouTube Music">YouTube Music</option>
                <option value="Tidal">Tidal</option>
                <option value="Last.fm">Last.fm</option>
                <option value="Local / Vinyl">Local Files / Vinyl</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Bio / Musical Philosophy
              </label>
              <input
                type="text"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="e.g. Always looking for hidden gems"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Favorite Genres Tagger */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Favorite Genres
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {formData.favoriteGenres.map((genre) => (
                <span
                  key={genre}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-400 flex items-center gap-1 font-mono"
                >
                  <span>{genre}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGenre(genre)}
                    className="hover:text-rose-400 p-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add genre input */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newGenreInput}
                onChange={(e) => setNewGenreInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddGenre(newGenreInput);
                  }
                }}
                placeholder="Type a custom genre and press enter..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleAddGenre(newGenreInput)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1 text-[11px] text-slate-400">
              <span className="text-slate-500 font-mono self-center mr-1">Suggestions:</span>
              {SUGGESTED_GENRES.map((sg) => (
                <button
                  key={sg}
                  type="button"
                  onClick={() => handleAddGenre(sg)}
                  disabled={formData.favoriteGenres.includes(sg)}
                  className="px-2 py-0.5 rounded-md bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  +{sg}
                </button>
              ))}
            </div>
          </div>

          {/* Top Artists Tagger */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Favorite Artists
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {formData.topArtists.map((artist) => (
                <span
                  key={artist}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center gap-1 font-mono"
                >
                  <Disc className="w-3 h-3 text-emerald-400" />
                  <span>{artist}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveArtist(artist)}
                    className="hover:text-rose-400 p-0.5 cursor-pointer ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newArtistInput}
                onChange={(e) => setNewArtistInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddArtist();
                  }
                }}
                placeholder="Add artist name..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddArtist}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Stored locally in browser storage
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
