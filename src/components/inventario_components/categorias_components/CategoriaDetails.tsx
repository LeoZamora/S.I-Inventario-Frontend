import { Box } from '@mui/material';
import { forwardRef } from 'react';

// Así debería quedar tu componente de detalles
const DetailsCategory = forwardRef((props, ref) => {
  return (
    <Box ref={ref} {...props}> 
      {/* Tu contenido actual */}
      <h2>Detalles de Categoría</h2>
    </Box>
  );
});

export default DetailsCategory;