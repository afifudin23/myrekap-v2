import { memo } from "react";
import { NavbarLogo, NavbarUserMenu } from ".";

const Navbar = memo(function () {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <nav className="p-3 px-10 w-full flex justify-between bg-white items-center">
            <NavbarLogo />
            <NavbarUserMenu fullName={user.fullName} role={user.role} />
        </nav>
    );
});

export default Navbar;
