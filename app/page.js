// page.js
"use client";
import { useState, useEffect } from 'react';
import { firestore } from "../firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, setDoc, query, getDoc } from 'firebase/firestore';
import Recipes from "./components/recipes";
import InventoryChart from "./components/InventoryChart"; // Import the chart component

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 2,
          minHeight: '100vh',
          backgroundColor: '#1a202c',
          color: '#e2e8f0',
          overflowX: 'hidden',
        }}
      >
        <Recipes inventory={inventory} />
        <InventoryChart inventory={inventory} /> {/* Add the chart here */}
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 400,
              bgcolor: '#2d3748',
              border: '2px solid #4a5568',
              boxShadow: 24,
              p: 4,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: '#e2e8f0' }}>Add Item</Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                sx={{ bgcolor: '#4a5568', input: { color: '#e2e8f0' } }}
              />
              <Button
                variant="contained"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
                sx={{ backgroundColor: '#63b3ed', color: '#fff', '&:hover': { backgroundColor: '#3182ce' } }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ mb: 2, backgroundColor: '#2b6cb0', color: '#fff', '&:hover': { backgroundColor: '#2c5282' } }}
        >
          Add New Item
        </Button>
        <Box
          sx={{
            width: '100%',
            maxWidth: 800,
            border: '1px solid #2d3748',
            backgroundColor: '#2d3748',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              padding: 2,
              backgroundColor: '#1a202c',
              textAlign: 'center',
            }}
          >
            <Typography variant="h2" sx={{ margin: 0, color: '#e2e8f0', fontSize: '2rem', fontWeight: 'bold' }}>
              Inventory Items
            </Typography>
          </Box>
          <Stack
            spacing={2}
            sx={{ padding: 2 }}
          >
            {inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 2,
                  backgroundColor: '#2d3748',
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', color: '#e2e8f0' }}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', color: '#e2e8f0' }}>
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => addItem(name)}
                    sx={{ backgroundColor: '#63b3ed', color: '#fff', '&:hover': { backgroundColor: '#3182ce' } }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => removeItem(name)}
                    sx={{ backgroundColor: '#fc8181', color: '#fff', '&:hover': { backgroundColor: '#e53e3e' } }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
