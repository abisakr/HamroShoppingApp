const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay, setMenuDisplay] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search, setSearch] = useState(searchQuery)
 

  const handleLogout = async () => {
    try {
      const response = await fetch("https://localhost:7223/api/UserAccount/logout", {
        method: 'POST',
        credentials: 'include', // Include JWT cookie
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "You have been logged out successfully.");
        dispatch(setUserDetails(null));  // Clear user details from Redux
        navigate("/");  // Redirect to home
      } else {
        toast.error(data.message || "Failed to log out.");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Something went wrong during logout.");
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target
    setSearch(value)

    if (value) {
      navigate(`/search?q=${value}`)
    } else {
      navigate("/search")
    }
  }

  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <div className=' h-full container mx-auto flex items-center px-4 justify-between'>
        <div className=''>
          <Link to={"/"}>
            <Logo w={180} h={70} />
          </Link>
        </div>

        <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
          <input type='text' placeholder='Search product here...' className='w-full outline-none' onChange={handleSearch} value={search} />
          <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white hover:bg-red-700  cursor-pointer'>
            <GrSearch />
          </div>
        </div>

        <div className='flex items-center gap-7'>
          <div className='relative flex justify-center'>
            {token && (
              <div className='text-3xl cursor-pointer relative flex justify-center' onClick={() => setMenuDisplay(preve => !preve)}>
                {user?.profilePic ? (
                  <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>
            )}

            {menuDisplay && (
              <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded'>
                <nav>
                  {user?.role === ROLE.ADMIN && (
                    <Link to={"/admin-panel/all-products"} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={() => setMenuDisplay(preve => !preve)}>Admin Panel</Link>
                  )}
                </nav>
              </div>
            )}
          </div>

          {token && (
            <Link to={"/cart"} className='text-2xl relative'>
              <span><FaShoppingCart /></span>

              <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                <p className='text-sm'>{context?.cartProductCount}</p>
              </div>
            </Link>
          )}

          <div>
            {token ? (
              <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Logout</button>
            ) : (
              <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;
