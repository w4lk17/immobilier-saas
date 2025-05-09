import {
	DM_Sans,
	Geist,
	Geist_Mono,
	Instrument_Sans,
	Inter,
	Mulish,
	Noto_Sans_Mono,
} from 'next/font/google';

export const dm_sans = DM_Sans({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
	variable: '--font-dm-sans',
});

const fontSans = Geist({
	subsets: ["latin"],
	variable: "--font-sans",
})

const fontMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
})

const fontInstrument = Instrument_Sans({
	subsets: ["latin"],
	variable: "--font-instrument",
})

const fontNotoMono = Noto_Sans_Mono({
	subsets: ["latin"],
	variable: "--font-noto-mono",
})

const fontMullish = Mulish({
	subsets: ["latin"],
	variable: "--font-mullish",
})

const fontInter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
})