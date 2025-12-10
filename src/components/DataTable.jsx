import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { DraggableColumnHeader } from './DraggableColumnHeader';
import { enrichDataWithComputedFields } from '../utils/computed';

/**
 * High-performance data table component with:
 * - Virtual scrolling for handling large datasets
 * - Drag-and-drop column reordering
 * - Sortable columns
 * - Computed fields (Full Name, DSR)
 * - Material-UI styling
 */
export const DataTable = ({ rawData }) => {
  // Initialize columnOrder with all column IDs for drag-and-drop to work
  const [columnOrder, setColumnOrder] = useState([
    'id',
    'firstName',
    'lastName',
    'fullName',
    'email',
    'city',
    'registeredDate',
    'dsr',
  ]);
  const [sorting, setSorting] = useState([]);

  // Enrich data with computed fields (Full Name and DSR)
  // This happens at the component level, not in storage
  const enrichedData = useMemo(() => {
    return enrichDataWithComputedFields(rawData);
  }, [rawData]);

  // Column definitions with sorting and display configuration
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 120,
        cell: info => (
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {info.getValue().slice(0, 8)}...
          </Typography>
        ),
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        size: 150,
        cell: info => (
          <Typography variant="body2" fontWeight={500}>
            {info.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 150,
        cell: info => (
          <Typography variant="body2" fontWeight={500}>
            {info.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'fullName',
        header: 'Full Name',
        size: 200,
        enableSorting: true,
        meta: {
          isComputed: true,
          description: 'Computed from firstName + lastName'
        },
        cell: info => (
          <Typography variant="body2" fontWeight={600} color="primary.main">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 250,
        cell: info => (
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {info.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'city',
        header: 'City',
        size: 150,
        cell: info => (
          <Typography variant="body2">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'registeredDate',
        header: 'Registered Date',
        size: 150,
        cell: info => (
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {info.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'dsr',
        header: 'DSR',
        size: 120,
        enableSorting: true,
        meta: {
          isComputed: true,
          isDynamic: true,
          description: 'Days Since Registration - computed dynamically'
        },
        cell: info => {
          const days = info.getValue();
          return (
            <Chip
              label={`${days} ${days === 1 ? 'day' : 'days'}`}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          );
        }
      },
    ],
    []
  );

  // Initialize table with TanStack Table
  const table = useReactTable({
    data: enrichedData,
    columns,
    state: {
      columnOrder,
      sorting,
    },
    onColumnOrderChange: setColumnOrder,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  // Set up drag-and-drop sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // Handle column reordering via drag-and-drop
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active && over && active.id !== over.id) {
      setColumnOrder((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  // Virtual scrolling setup for performance
  const tableContainerRef = useMemo(() => ({ current: null }), []);
  
  const rows = table.getRowModel().rows;
  
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 53,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <Box>
      {/* Table Container with Virtual Scrolling */}
      <TableContainer
        component={Paper}
        ref={tableContainerRef}
        elevation={3}
        sx={{
          maxHeight: 'calc(100vh - 200px)',
          minHeight: '600px',
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
        }}
      >
        <Table 
          stickyHeader 
          sx={{ 
            minWidth: 1200,
            '& .MuiTableHead-root': {
              position: 'sticky',
              top: 0,
              zIndex: 100,
            },
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  <SortableContext
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => (
                      <DraggableColumnHeader
                        key={header.id}
                        header={header}
                      />
                    ))}
                  </SortableContext>
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {paddingTop > 0 && (
                <TableRow>
                  <td style={{ height: `${paddingTop}px` }} />
                </TableRow>
              )}
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.08) !important',
                      },
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          padding: '12px 16px',
                          width: cell.column.getSize(),
                          maxWidth: cell.column.getSize(),
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          borderBottom: '1px solid rgba(224, 224, 224, 1)',
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </TableRow>
                );
              })}
              {paddingBottom > 0 && (
                <TableRow>
                  <td style={{ height: `${paddingBottom}px` }} />
                </TableRow>
              )}
            </TableBody>
          </DndContext>
        </Table>
      </TableContainer>
    </Box>
  );
};
