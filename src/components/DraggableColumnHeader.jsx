import { flexRender } from '@tanstack/react-table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableCell, Box, Tooltip, Chip } from '@mui/material';
import {
  DragIndicator,
  ArrowUpward,
  ArrowDownward,
  UnfoldMore,
} from '@mui/icons-material';

/**
 * Draggable column header component with sorting functionality
 * Styled with Material-UI
 */
export const DraggableColumnHeader = ({ header }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: header.column.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.5 : 1,
    width: header.getSize(),
  };

  // Get sort direction for this column
  const sortDirection = header.column.getIsSorted();
  const canSort = header.column.getCanSort();

  // Meta information about computed columns
  const isComputed = header.column.columnDef.meta?.isComputed;
  const isDynamic = header.column.columnDef.meta?.isDynamic;
  const description = header.column.columnDef.meta?.description;

  // Sort icon based on current state
  const getSortIcon = () => {
    if (!canSort) return null;
    
    if (sortDirection === 'asc') {
      return <ArrowUpward sx={{ fontSize: 18, color: 'primary.main', fontWeight: 700 }} />;
    } else if (sortDirection === 'desc') {
      return <ArrowDownward sx={{ fontSize: 18, color: 'primary.main', fontWeight: 700 }} />;
    }
    return <UnfoldMore sx={{ fontSize: 18, color: 'grey.400' }} />;
  };

  return (
    <TableCell
      ref={setNodeRef}
      style={style}
      sx={{
        bgcolor: isDragging 
          ? 'grey.100'
          : 'white',
        color: 'text.primary',
        fontWeight: 700,
        fontSize: '0.875rem',
        padding: '16px 12px !important',
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none',
        borderBottom: '2px solid',
        borderBottomColor: 'grey.300',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.2s ease',
        boxShadow: isDragging ? 2 : '0 2px 4px rgba(0,0,0,0.1)',
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -2,
          height: 2,
          bgcolor: 'grey.300',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        {/* Drag Handle */}
        <Tooltip title="Drag to reorder" arrow placement="top">
          <DragIndicator
            {...attributes}
            {...listeners}
            sx={{
              cursor: 'grab',
              color: 'grey.400',
              fontSize: 20,
              transition: 'color 0.2s',
              '&:hover': {
                color: 'primary.main',
              },
              '&:active': {
                cursor: 'grabbing',
              },
            }}
          />
        </Tooltip>

        {/* Column Header Text */}
        <Box
          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: canSort ? 'pointer' : 'default',
            padding: '4px 8px',
            borderRadius: 1,
            transition: 'all 0.2s',
            '&:hover': canSort ? {
              bgcolor: 'grey.50',
            } : {},
          }}
        >
          <Box sx={{ flex: 1, fontWeight: 700, color: 'text.primary' }}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </Box>

          {/* Sort Indicator */}
          {canSort && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {getSortIcon()}
            </Box>
          )}

          {/* Computed Field Badge */}
          {isComputed && (
            <Tooltip title={description || 'Computed field'} arrow placement="top">
              <Chip
                label={isDynamic ? '⚡' : '🧮'}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.75rem',
                  bgcolor: isComputed ? 'primary.50' : 'grey.100',
                  color: 'primary.main',
                  cursor: 'help',
                  fontWeight: 600,
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            </Tooltip>
          )}
        </Box>
      </Box>
    </TableCell>
  );
};
