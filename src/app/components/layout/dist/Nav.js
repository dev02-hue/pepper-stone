'use client';
"use strict";
exports.__esModule = true;
exports.Nav = void 0;
var react_1 = require("react");
var link_1 = require("next/link");
var framer_motion_1 = require("framer-motion");
var fi_1 = require("react-icons/fi");
var ri_1 = require("react-icons/ri");
var google_1 = require("next/font/google");
var poppins = google_1.Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700']
});
exports.Nav = function () {
    var _a = react_1.useState(false), menuOpen = _a[0], setMenuOpen = _a[1];
    var _b = react_1.useState(false), scrolled = _b[0], setScrolled = _b[1];
    var _c = react_1.useState(null), hoveredLink = _c[0], setHoveredLink = _c[1];
    var _d = react_1.useState(null), mobileSubmenu = _d[0], setMobileSubmenu = _d[1];
    react_1.useEffect(function () {
        var handleScroll = function () {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return function () { return window.removeEventListener('scroll', handleScroll); };
    }, []);
    var navLinks = [
        { href: "/", label: "Home" },
        {
            href: "/services",
            label: "Services",
            submenu: [
                { href: "/services", label: "Investment Solutions" },
                { href: "/services", label: "Wealth Management" },
                { href: "/services", label: "Retirement Planning" }
            ]
        },
        { href: "/about", label: "About Us" },
        { href: "/blog", label: "Market Research" },
        { href: "/contact", label: "Contact" },
    ];
    var authLinks = [
        { href: "/login", label: "Investor Login" },
        { href: "/register", label: "Register", isPrimary: true },
    ];
    var itemVariants = {
        closed: { opacity: 0, y: -20 },
        open: { opacity: 1, y: 0 }
    };
    var menuVariants = {
        closed: {
            height: 0,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
                when: "afterChildren"
            }
        },
        open: {
            height: "auto",
            transition: {
                staggerChildren: 0.1,
                staggerDirection: 1
            }
        }
    };
    return (React.createElement("header", { className: poppins.className + "  w-full z-50" },
        React.createElement(framer_motion_1.motion.div, { className: "bg-gray-900 text-gray-300 text-sm flex justify-between items-center px-6 py-2", initial: { y: -40 }, animate: { y: 0 }, transition: { duration: 0.5 } },
            React.createElement("div", { className: "flex items-center space-x-4" },
                React.createElement("span", { className: "flex items-center" },
                    React.createElement(ri_1.RiExchangeFill, { className: "mr-2 text-blue-400" }),
                    "Level 4, 114 William Street, Melbourne VIC 3000")),
            React.createElement("div", { className: "hidden md:flex items-center space-x-4" },
                React.createElement("span", { className: "text-gray-500" }, "|"),
                React.createElement("a", { href: "tel:+1234567890", className: "hover:text-blue-400 transition-colors" }, "+61 3 1234 5678"))),
        React.createElement(framer_motion_1.motion.nav, { className: "bg-white shadow-sm transition-all duration-300 " + (scrolled ? 'py-2 shadow-lg' : 'py-4'), initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.2 } },
            React.createElement("div", { className: "container mx-auto px-6 flex justify-between items-center" },
                React.createElement(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "relative" },
                    React.createElement(link_1["default"], { href: "/", className: "flex items-center" },
                        React.createElement("span", { className: "bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-xl px-6 py-3 rounded-lg shadow-md" }, "TTRADECAPITAL"))),
                React.createElement("div", { className: "hidden lg:flex items-center space-x-8" },
                    React.createElement("ul", { className: "flex space-x-8" }, navLinks.map(function (link) { return (React.createElement("li", { key: link.href, className: "relative", onMouseEnter: function () { return setHoveredLink(link.href); }, onMouseLeave: function () { return setHoveredLink(null); } },
                        React.createElement(link_1["default"], { href: link.href, className: "flex items-center px-2 py-1 font-medium transition-colors " + (hoveredLink === link.href ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500') },
                            link.label,
                            link.submenu && (React.createElement("span", { className: "ml-1" }, hoveredLink === link.href ? React.createElement(fi_1.FiChevronUp, null) : React.createElement(fi_1.FiChevronDown, null)))),
                        link.submenu && hoveredLink === link.href && (React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, className: "absolute left-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50" }, link.submenu.map(function (subItem) { return (React.createElement(link_1["default"], { key: subItem.href, href: subItem.href, className: "block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100 last:border-b-0" }, subItem.label)); }))))); })),
                    React.createElement("div", { className: "flex items-center space-x-4 ml-6" }, authLinks.map(function (link) { return (React.createElement(framer_motion_1.motion.div, { key: link.href, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } },
                        React.createElement(link_1["default"], { href: link.href, className: "px-5 py-2 rounded-lg font-medium transition-all " + (link.isPrimary
                                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md hover:shadow-lg'
                                : 'text-gray-700 hover:text-blue-600') }, link.label))); }))),
                React.createElement("button", { onClick: function () { return setMenuOpen(!menuOpen); }, className: "lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none", "aria-label": "Toggle menu" }, menuOpen ? (React.createElement(fi_1.FiX, { className: "text-2xl" })) : (React.createElement(fi_1.FiMenu, { className: "text-2xl" })))),
            React.createElement(framer_motion_1.AnimatePresence, null, menuOpen && (React.createElement(framer_motion_1.motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.3 }, className: "lg:hidden overflow-hidden" },
                React.createElement(framer_motion_1.motion.ul, { variants: menuVariants, initial: "closed", animate: "open", exit: "closed", className: "px-6 py-4 space-y-4" },
                    navLinks.map(function (link) { return (React.createElement(framer_motion_1.motion.li, { key: link.href, variants: itemVariants },
                        React.createElement("div", { className: "flex flex-col" },
                            React.createElement("div", { className: "flex items-center justify-between py-2", onClick: function () { return setMobileSubmenu(mobileSubmenu === link.href ? null : link.href); } },
                                React.createElement(link_1["default"], { href: link.href, className: "text-gray-700 font-medium text-lg", onClick: function () { return !link.submenu && setMenuOpen(false); } }, link.label),
                                link.submenu && (React.createElement("span", { className: "text-gray-500" }, mobileSubmenu === link.href ? React.createElement(fi_1.FiChevronUp, null) : React.createElement(fi_1.FiChevronDown, null)))),
                            link.submenu && mobileSubmenu === link.href && (React.createElement(framer_motion_1.motion.div, { initial: { height: 0 }, animate: { height: 'auto' }, exit: { height: 0 }, className: "pl-4 overflow-hidden" }, link.submenu.map(function (subItem) { return (React.createElement(link_1["default"], { key: subItem.href, href: subItem.href, className: "block py-2 text-gray-600 hover:text-blue-600", onClick: function () { return setMenuOpen(false); } }, subItem.label)); })))))); }),
                    authLinks.map(function (link) { return (React.createElement(framer_motion_1.motion.li, { key: link.href, variants: itemVariants, className: "pt-2 border-t border-gray-200" },
                        React.createElement(link_1["default"], { href: link.href, className: "block w-full py-3 px-4 rounded-lg text-center font-medium " + (link.isPrimary
                                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md'
                                : 'text-gray-700 border border-gray-300'), onClick: function () { return setMenuOpen(false); } }, link.label))); }))))))));
};
