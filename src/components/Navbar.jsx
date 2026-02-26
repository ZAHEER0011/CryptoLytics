import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBitcoinSign } from '@fortawesome/free-solid-svg-icons'
import '../index.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { faBots, faGithub, faLinkedin, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'

function Navbar({ toggleChat }) {
    const menu = ['Home', 'All Crypto', 'Services', 'Contact']
    const navigate = useNavigate();
    function navigateHandler(index) {
        const item = menu[index];
        navigate(`/${item}`)
    }
    return (
        <>
            <header className='w-full bg-[var(--color-bg-dark)] text-[var(--color-text-primary)]'>
                <nav className='flex justify-between items-center w-11/12 mx-auto px-6 py-3 '>
                    <div className='flex gap-0.5 justify-center items-center cursor-pointer' onClick={()=>{navigate("/")}}>
                        <FontAwesomeIcon icon={faBitcoinSign} className='text-4xl' />
                        <h1 className='font-bold text-2xl font-serif italic'>CryptoLytics</h1>
                    </div>
                    {/* <div>
                        <ul className='flex justify-center items-center gap-10'>
                            {menu.map((item, index) => (
                                <div className='flex flex-col gap-1 justify-center items-start group' >
                                    <li className='cursor-pointer' key={index}>{item}</li>
                                    <div className='w-0 h-1 group-hover:w-full transition-all duration-300 ease-in-out bg-(--color-text-primary)'></div>
                                </div>
                            ))}
                        </ul>
                    </div> */}
                    {/* <div>
                        <button className='p-2 font-semibold bg-blue-950 border-2 rounded-md cursor-pointer'>Developer LinkedIn</button>
                    </div> */}
                    <div className="flex items-center gap-8">

                        <a href="https://github.com/ZAHEER0011" className='group' target="_blank">
                            <FontAwesomeIcon  icon={faGithub} style={{ fontSize: '30px' }} className="p-2 text-[aliceblue] group-hover:bg-[aliceblue] group-hover:text-[black] rounded-full transition" />
                            {/* <Github className="w-5 h-5 text-[aliceblue] group-hover:bg-[aliceblue] group-hover:text-[black] p-4 rounded-full transition" /> */}
                        </a>

                        <a href="https://linkedin.com/in/zaheer-patel" className='group' target="_blank">
                            <FontAwesomeIcon  icon={faLinkedinIn} style={{ fontSize: '30px' }} className="p-2 text-[aliceblue] group-hover:bg-[aliceblue] group-hover:text-[black] rounded-full transition" />
                            {/* <Linkedin className="w-5 h-5 hover:text-primary transition" /> */}
                        </a>

                        {/* <Button
                            onClick={toggleChat}
                            className="group"
                        >
                            <Bot className="w-xl h-xl p-2 text-[aliceblue] group-hover:bg-[aliceblue] group-hover:text-[black] rounded-full transition" />
                        </Button> */}

                        {/* <button className='group' onClick={toggleChat}>
                            <FontAwesomeIcon icon={faBots} style={{ fontSize: '30px' }} className="cursor-pointer p-2 text-[aliceblue] group-hover:bg-[aliceblue] group-hover:text-[black] rounded-full transition" />
                            <Bot className="w-12 h-12 p-3 text-[aliceblue] group-hover:bg-[aliceblue] group-hover:text-[black] rounded-full transition" />
                        </button> */}

                    </div>
                </nav>
            </header>
        </>
    )
}

export default Navbar
