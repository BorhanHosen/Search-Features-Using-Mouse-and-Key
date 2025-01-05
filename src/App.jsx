import React, { useState, useEffect, useRef } from "react";

const App = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); // Track selected user index
  const dropdownRef = useRef(null); // Ref for the dropdown

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    setSelectedIndex(-1); // Reset selected index on input change
    if (value) {
      setIsOpenSearch(true);
      const search = users.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(search);
    } else {
      setFilteredUsers(users);
      setIsOpenSearch(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default form submission
      if (selectedIndex >= 0) {
        setUserName(filteredUsers[selectedIndex].name);
        setIsOpenSearch(false); // Close the search dropdown
      }
    } else if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => {
        const newIndex = Math.min(prevIndex + 1, filteredUsers.length - 1);
        scrollToSelected(newIndex);
        return newIndex;
      });
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => {
        const newIndex = Math.max(prevIndex - 1, 0);
        scrollToSelected(newIndex);
        return newIndex;
      });
    }
  };

  const scrollToSelected = (index) => {
    if (dropdownRef.current) {
      const selectedElement = dropdownRef.current.children[index];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  };

  return (
    <div className="h-screen w-screen justify-center bg-gray-900">
      <div className="flex justify-center items-center flex-col pt-20">
        <div className="flex justify-center">
          <h1 className="text-4xl font-semibold text-white mb-4">
            Search-Features-Using-Mouse-and-Key
          </h1>
        </div>
        <div className="flex flex-col w-1/3 bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-xl font-semibold text-white mb-4">
            Selected Name: {userName}
          </h1>
          <form>
            <input
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Search User..."
              value={userName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            {isOpenSearch && (
              <div
                ref={dropdownRef}
                className="bg-gray-700 w-full mt-2 max-h-32 overflow-auto rounded-md shadow-lg"
              >
                {filteredUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className={`p-2 cursor-pointer hover:bg-gray-600 transition-colors duration-200 ${
                      selectedIndex === index ? "bg-gray-500" : ""
                    }`} // Highlight selected user
                    onMouseEnter={() => setSelectedIndex(index)} // Optional: highlight on hover
                    onClick={() => {
                      setUserName(user.name);
                      setIsOpenSearch(false);
                    }}
                  >
                    <h1 className="text-white">{user.name}</h1>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
