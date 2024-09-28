import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

const ScrollVertical = ({ state }) => {
  const [categorys, setCategorys] = useState([]);
  const [category, setCategory] = useState('All');

  const fetchCategory = async () => {
    const response = await fetch('/api/home/category', {
      method: 'GET',
    });
    const json = await response.json();
    if (response.ok) {
      setCategorys(json.categorys);
      console.log(category);
    } else {
      console.log(json.error);
    }
  };
  useEffect(() => {
    fetchCategory();
  });
  return (
    <div className="scrollbar-container">
      <Scrollbars autoHide>
        <p
          id="All"
          className="scroll-nav"
          onClick={() => {
            state('All');

            setCategory('All');
          }}
        >
          All Category
        </p>
        {categorys &&
          categorys.map((value) => {
            return (
              <p
                id={value.category}
                className="scroll-nav"
                onClick={() => {
                  state(value.category);
                  setCategory(value.category);
                }}
              >
                {value.category}
              </p>
            );
          })}
      </Scrollbars>
    </div>
  );
};

export default ScrollVertical;
