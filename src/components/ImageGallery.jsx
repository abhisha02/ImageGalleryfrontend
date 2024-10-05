import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {  X } from 'lucide-react'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { fetchImages, updateImageOrder, updateImage, deleteImage } from '../features/images/imageSlice';
import toast from 'react-hot-toast';

// Simplified EditModal component

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(5px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1050,
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
};

const modalContentStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  borderRadius: '1rem',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  padding: '2rem',
  maxWidth: '500px',
  width: '100%',
  transform: 'scale(0.9)',
  transition: 'transform 0.3s ease-in-out',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  color: '#6c757d',
  transition: 'color 0.2s ease-in-out',
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '2rem',
  marginRight: '0.75rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  lineHeight: '1.5',
  color: '#495057',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backgroundClip: 'padding-box',
  border: '2px solid #ced4da',
  borderRadius: '0.5rem',
  transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  marginBottom: '1rem',
};

const DeleteConfirmationModal = ({ isOpen, closeModal, onConfirm, imageName }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div style={{
      ...modalOverlayStyle,
      opacity: isOpen ? 1 : 0,
    }}>
      <div style={{
        ...modalContentStyle,
        transform: isOpen ? 'scale(1)' : 'scale(0.9)',
      }}>
        <button onClick={closeModal} style={closeButtonStyle}>
          <X size={24} />
        </button>
        <h2 style={{ marginBottom: '1.5rem', color: '#343a40', fontSize: '1.75rem' }}>Confirm Deletion</h2>
        <p style={{ marginBottom: '2rem', color: '#495057', fontSize: '1.1rem' }}>
          Are you sure you want to delete <strong>{imageName}</strong>? This action cannot be undone.
        </p>
        <div>
          <button
            onClick={onConfirm}
            style={{
              ...buttonStyle,
              backgroundColor: '#dc3545',
              color: 'white',
              boxShadow: '0 4px 6px rgba(220, 53, 69, 0.25)',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Delete
          </button>
          <button
            onClick={closeModal}
            style={{
              ...buttonStyle,
              backgroundColor: '#f8f9fa',
              color: '#343a40',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const SimplifiedEditModal = ({ isOpen, closeModal, image, onSave }) => {
  const [title, setTitle] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (image) {
        setTitle(image.title || '');
      }
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen, image]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, newImage });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div style={{
      ...modalOverlayStyle,
      opacity: isOpen ? 1 : 0,
    }}>
      <div style={{
        ...modalContentStyle,
        transform: isOpen ? 'scale(1)' : 'scale(0.9)',
      }}>
        <button onClick={closeModal} style={closeButtonStyle}>
          <X size={24} />
        </button>
        <h2 style={{ marginBottom: '1.5rem', color: '#343a40', fontSize: '1.75rem' }}>Edit Image</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', color: '#495057', fontSize: '1.1rem' }}>Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="image" style={{ display: 'block', marginBottom: '0.5rem', color: '#495057', fontSize: '1.1rem' }}>Change Image:</label>
            <input
              id="image"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              style={{
                ...inputStyle,
                padding: '0.5rem',
              }}
            />
          </div>
          <div>
            <button
              type="submit"
              style={{
                ...buttonStyle,
                backgroundColor: '#007bff',
                color: 'white',
                boxShadow: '0 4px 6px rgba(0, 123, 255, 0.25)',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={closeModal}
              style={{
                ...buttonStyle,
                backgroundColor: '#f8f9fa',
                color: '#343a40',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SortableItem = ({ id, image, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={{
        ...style,
        position: 'relative',
        height: '100%',
        border: '1px solid rgba(0,0,0,.125)',
        borderRadius: '.25rem',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        left: '0.5rem',
        zIndex: 10,
        cursor: 'grab',
      }} {...attributes} {...listeners}>
        <GripVertical size={20} color="white" />
      </div>
      <div style={{ height: '12rem' }}>
        <img
          src={image.image || image.url || image.image_url || image.file || image.path}
          alt={image.title || `Image ${id}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            console.error('Failed to load image:', image);
            e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
          }}
        />
      </div>
      <div style={{ padding: '1rem' }}>
        <p style={{ textAlign: 'center', margin: 0 }}>{image.title || `Image ${id}`}</p>
      </div>
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <button 
            onClick={() => onEdit(image)} 
            style={{
              marginRight: '0.5rem',
              padding: '0.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
            }}
          >
            <Edit2 size={20} />
          </button>
          <button 
            onClick={() => onDelete(image)} 
            style={{
              padding: '0.5rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

const ImageGallery = () => {
  const dispatch = useDispatch();
  const { images, status } = useSelector(state => state.images);
  const [items, setItems] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  useEffect(() => {
    setItems(images);
  }, [images]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        dispatch(updateImageOrder(newItems.map((img, index) => ({ id: img.id, order: index }))));
        return newItems;
      });
    }
  }, [dispatch]);

  const handleEdit = useCallback((image) => {
    console.log('Edit button clicked:', image);
    setEditingImage(image);
    setIsEditModalOpen(true);
    console.log('isEditModalOpen set to:', true);
  }, []);

  const handleSaveEdit = useCallback(({ title, newImage }) => {
    console.log('handleSaveEdit called with:', { title, newImage });
    if (editingImage) {
      const formData = new FormData();
      formData.append('title', title);
      if (newImage) {
        formData.append('image', newImage);
      }
      dispatch(updateImage({ id: editingImage.id, formData }))
        .unwrap()
        .then(() => {
          toast.success('Image updated successfully');
          setIsEditModalOpen(false);
          setEditingImage(null);
          console.log('Image updated, modal closed');
        })
        .catch((error) => {
          toast.error('Failed to update image');
          console.error('Update image error:', error);
        });
    }
  }, [editingImage, dispatch]);

  const handleDelete = useCallback((image) => {
    setIsDeletingImage(image);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (isDeletingImage) {
      dispatch(deleteImage(isDeletingImage.id))
        .unwrap()
        .then(() => {
          toast.success('Image deleted successfully');
          setIsDeleteModalOpen(false);
          setIsDeletingImage(null);
        })
        .catch(() => {
          toast.error('Failed to delete image');
        });
    }
  }, [isDeletingImage, dispatch]);

  if (status === 'loading') {
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>Loading images...</div>;
  }

  if (status === 'failed') {
    return <div style={{
      padding: '1rem',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderRadius: '0.25rem',
    }}>Failed to load images. Please try again later.</div>;
  }

  if (!Array.isArray(items) || items.length === 0) {
    return <div style={{
      padding: '1rem',
      backgroundColor: '#cce5ff',
      color: '#004085',
      borderRadius: '0.25rem',
    }}>No images to display</div>;
  }

  console.log('Rendering ImageGallery, isEditModalOpen:', isEditModalOpen);

  return (
    <div style={{ padding: '1rem' }}>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(item => item.id)}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {items.map((image) => (
              <SortableItem 
                key={image.id}
                id={image.id} 
                image={image} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <SimplifiedEditModal
        isOpen={isEditModalOpen}
        closeModal={() => {
          setIsEditModalOpen(false);
          setEditingImage(null);
          console.log('EditModal closed');
        }}
        image={editingImage}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={() => {
          setIsDeleteModalOpen(false);
          setIsDeletingImage(null);
        }}
        onConfirm={confirmDelete}
        imageName={isDeletingImage?.title}
      />
    </div>
  );
};

export default ImageGallery;