import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import { FaImage } from 'react-icons/fa';

function DragAndDropImage(props) {
  const [dragging, setDragging] = useState(false);
  const [image, setImage] = useState(null);

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];
    props.onChildStateChange(event.dataTransfer.files[0])
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: dragging ? '2px dashed #000' : 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: dragging ? '#f1f1f1' : 'white',
        color: dragging ? '#000' : '#333',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {image && (
        <img
          src={image}
          alt="logo"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {!image && (
        <IconContext.Provider value={{ style: { verticalAlign: 'middle', width: '100px', height: '100px' } }}>
            <div className='icon-context'>
                <FaImage/> 
            </div>
        </IconContext.Provider>
      )}
    </div>
  );
}

export default DragAndDropImage;
