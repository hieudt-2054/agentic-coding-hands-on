import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			// Google OAuth profile photos (avatar_url from Supabase Auth `raw_user_meta_data`)
			{ protocol: 'https', hostname: 'lh3.googleusercontent.com' },
			{ protocol: 'https', hostname: 'lh4.googleusercontent.com' },
			{ protocol: 'https', hostname: 'lh5.googleusercontent.com' },
			{ protocol: 'https', hostname: 'lh6.googleusercontent.com' },
			// Supabase Storage public buckets (for future kudo images)
			{ protocol: 'https', hostname: '*.supabase.co' },
			{ protocol: 'http', hostname: '127.0.0.1', port: '54321' },
		],
	},
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
