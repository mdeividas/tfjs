import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LazyLoad } from './components/LazyLoad';
import { RPSPage } from './Pages/RPS';
import { DashRunPage } from './Pages/DashRun';
import './styles/tailwind.css';

export const App: React.FC = () => (
    <>
        <Routes>
            <Route
                path="/RPS"
                element={
                    <LazyLoad>
                        <RPSPage />
                    </LazyLoad>
                }
            />
            <Route
                path="/dash-run"
                element={
                    <LazyLoad>
                        <DashRunPage />
                    </LazyLoad>
                }
            />
            <Route path="*" element={<Navigate to="/RPS" />} />
        </Routes>

        <footer className="bg-white shadow mt-4 dark:bg-gray-800">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a
                            target="_blank"
                            href="www.linkedin.com/in/deividas-maciejauskas-58b2aba0"
                            className="hover:underline me-4 md:me-6"
                        >
                            Linkedin
                        </a>
                    </li>
                    <li>
                        <a href="mailto:m.deividas94@gmail.com" className="hover:underline me-4 md:me-6">
                            m.deividas94@gmail.com
                        </a>
                    </li>
                </ul>
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    © {new Date().getFullYear()}{' '}
                </span>
            </div>
        </footer>
    </>
);
