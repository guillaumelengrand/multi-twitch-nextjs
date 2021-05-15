import Link from 'next/link';

export default function NavBar({}) {
    return (
        <div className="w-full h-8">
            <div className="flex flex-row justify-center">
                <Link href="/">
                    <a className="px-1">Home</a>
                </Link>
                <Link href="/multitwitch">
                    <a className="px-1">MutliTwitch</a>
                </Link>
            </div>
        </div>
    );
}
