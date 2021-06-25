import Link from "next/link";
import { FaGithub, FaMoon, FaSun, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import siteMetadata from '@/data/siteMetadata.json'

const Footer: React.FC<{}> = ({
}) => {
    return (
        <footer>
            <div className="flex flex-col items-center mt-16  pb-7">
                <div className="flex mb-3 space-x-4 text-3xl md:text-2xl">
                    {siteMetadata.email !== "" && (
                        <a target="_blank" href={`mailto:${siteMetadata.email}`}>
                            <FaEnvelope className="cursor-pointer hover:text-twitter" />
                        </a>
                    )}
                    {siteMetadata.github !== "" && (
                        <a target="_blank" href={`https://github.com/${siteMetadata.github}`}>
                            <FaGithub className="cursor-pointer hover:text-github" />
                        </a>
                    )}
                    {siteMetadata.twitter !== "" && (
                        <a target="_blank" href={`https://twitter.com/${siteMetadata.twitter}`}>
                            <FaTwitter className="cursor-pointer hover:text-twitter" />
                        </a>
                    )}
                    {siteMetadata.linkedin !== "" && (
                        <a target="_blank" href={`https://www.linkedin.com/in/${siteMetadata.linkedin}`}>
                            <FaLinkedin className="cursor-pointer hover:text-linkedin" />
                        </a>
                    )}
                </div>
                <div className="flex mb-2 space-x-2 text-sm text-gray-500">
                    <div>{siteMetadata.author}</div>
                    <div>{`© ${new Date().getFullYear()}`}</div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;