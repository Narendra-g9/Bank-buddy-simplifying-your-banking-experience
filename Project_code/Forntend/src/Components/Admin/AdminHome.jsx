import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminHome = () => {
  const Navigate = useNavigate();
  useEffect(() => {
    let role = localStorage.getItem("role");

    if (role !== "1") {
      Navigate("/admin-login");
    }
  }, []);

  const Logout = () => {
    localStorage.clear();
    Navigate("/");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav
        className="p-4 text-white"
        style={{
          background:
            "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
        }}
      >
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className="hidden md:flex md:flex-col text-lg  w-64 p-4"
          style={{
            background:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
          }}
        >
          <Link
            to="add-user"
            className="mb-2 p-2 text-white flex items-center hover:bg-blue-100 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              width={24}
              height={24}
              fill="white"
            >
              <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z" />
            </svg>
            <span className="mx-2">Add Users</span>
          </Link>
          <Link
            to="view-users"
            className="mb-2 p-2 text-white hover:bg-blue-100 rounded flex "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              width={24}
              height={24}
              fill="white"
            >
              <path d="M48 48l88 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L32 0C14.3 0 0 14.3 0 32L0 136c0 13.3 10.7 24 24 24s24-10.7 24-24l0-88zM175.8 224a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm-26.5 32C119.9 256 96 279.9 96 309.3c0 14.7 11.9 26.7 26.7 26.7l56.1 0c8-34.1 32.8-61.7 65.2-73.6c-7.5-4.1-16.2-6.4-25.3-6.4l-69.3 0zm368 80c14.7 0 26.7-11.9 26.7-26.7c0-29.5-23.9-53.3-53.3-53.3l-69.3 0c-9.2 0-17.8 2.3-25.3 6.4c32.4 11.9 57.2 39.5 65.2 73.6l56.1 0zm-89.4 0c-8.6-24.3-29.9-42.6-55.9-47c-3.9-.7-7.9-1-12-1l-80 0c-4.1 0-8.1 .3-12 1c-26 4.4-47.3 22.7-55.9 47c-2.7 7.5-4.1 15.6-4.1 24c0 13.3 10.7 24 24 24l176 0c13.3 0 24-10.7 24-24c0-8.4-1.4-16.5-4.1-24zM464 224a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm-80-32a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM504 48l88 0 0 88c0 13.3 10.7 24 24 24s24-10.7 24-24l0-104c0-17.7-14.3-32-32-32L504 0c-13.3 0-24 10.7-24 24s10.7 24 24 24zM48 464l0-88c0-13.3-10.7-24-24-24s-24 10.7-24 24L0 480c0 17.7 14.3 32 32 32l104 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-88 0zm456 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l104 0c17.7 0 32-14.3 32-32l0-104c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 88-88 0z" />
            </svg>{" "}
            <span className="mx-2">View Users</span>
          </Link>
          <Link
            to="debit-card"
            className="mb-2 p-2 text-white hover:bg-blue-100 rounded flex "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="white"
              viewBox="0 0 576 512"
            >
              <path d="M64 32C28.7 32 0 60.7 0 96l0 32 576 0 0-32c0-35.3-28.7-64-64-64L64 32zM576 224L0 224 0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-192zM560 416L16 416c-8.8 0-16-7.2-16-16l0-144 576 0 0 144c0 8.8-7.2 16-16 16z" />
            </svg>
            <span className="mx-2">Debit Card</span>
          </Link>
          <Link
            to="admin-logout"
            className="mt-auto p-2 text-white hover:bg-blue-100 rounded flex"
            onClick={Logout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              width={24}
              height={24}
              fill="white"
            >
              <path d="M392 192l-56 56c-9.4 9.4-9.4 24.6 0 34l122 122H288c-13.3 0-24 10.7-24 24s10.7 24 24 24h270.7l-122 122c-9.4 9.4-9.4 24.6 0 34l56 56c9.4 9.4 24.6 9.4 34 0l175-175c9.4-9.4 9.4-24.6 0-34L426 192c-9.4-9.4-24.6-9.4-34 0zM120 64c-13.3 0-24 10.7-24 24v320c0 13.3 10.7 24 24 24h272c13.3 0 24-10.7 24-24V88c0-13.3-10.7-24-24-24H120z" />
            </svg>
            <span className="mx-2">Logout</span>
          </Link>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
