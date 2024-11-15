import {
    DataGrid,
    GridColDef,
    GridRowsProp,
    GridRowModesModel,
    useGridApiRef,
    GridRowId,
    GridActionsCellItem,
    GridRowSelectionModel,
    GridPaginationModel,
  } from '@mui/x-data-grid';
  import { useState } from 'react';
  // import toast from "react-hot-toast";
  import { Button, Tooltip } from '@mui/material';
  import RemoveCircleOutlineSharpIcon from '@mui/icons-material/RemoveCircleOutlineSharp';
  import CheckCircleOutlineSharpIcon from '@mui/icons-material/CheckCircleOutlineSharp';
  import AddchartIcon from '@mui/icons-material/Addchart';
  import { toast } from 'react-toastify';
  import PopUpModal from '@/components/global/popUpModal';
  import ChargesForm from '../../app/dashboard/bill_generation_process/meter_reading_entry/chargesForm';
  import { OtherChargeType } from '@/store/otherCharge/OtherChargeType';
  import { useLazyGetPreviousReadingQuery } from '@/store/Bill_Generation_process/PreBillProcess/PreBillProcessApiSlice';
  import { PreviousReadingResponse } from '@/store/Bill_Generation_process/PreBillProcess/PreBillProcessType';
  import { initialBillProcessEntryValues, meteredBillEntry } from '@/store/Bill_Generation_process/PrebillEntry/MeteredBillEntry';
  interface EditableGridForm {
    accountPrefix: string;
  }
  
  export function EditableGridForm({ accountPrefix }: EditableGridForm) {
    const apiRef = useGridApiRef();
    const [modalOpen,setModalOpen] = useState(false);
    const [rows, setRows] = useState<GridRowsProp>([
      initialBillProcessEntryValues,
    ]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [totalRows, setTotalRows] = useState<number>(1);
    const [rowSelectionModel, setRowSelectionModel] =
      useState<GridRowSelectionModel>([]);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
      pageSize: 5,
      page: 0,
    });
    const [triggerGetPreviousReading, { data }] = useLazyGetPreviousReadingQuery();
  
  
    const fetchPrevReading = async (seqno: string, chkDigit: string) => {
      const generatedAccountNo = `${accountPrefix}${seqno}${chkDigit}`;
    
      try {
        const response: any = await triggerGetPreviousReading(generatedAccountNo);
        
        console.log('Full response:', response);
    
        const body = response?.data?.response?.body;
    
        // Check if the body exists and has at least one element
        if (body && Array.isArray(body) && body.length > 0) {
          console.log('Previous Reading:', body[0]["previousReading"]);
          return body[0].previousReading || '';
        } else {
          console.error('Invalid response structure or empty body:', response);
          return '';
        }
      } catch (error) {
        console.error('Error fetching previous reading:', error);
        return '';
      }
    };
    
    
  
    // Function to handle row updates
    const handleProcessRowUpdate = async (editedRow: meteredBillEntry) => {
      const { id, seqno, chkDigit, presentReading, previousReading: prevReading } = editedRow;
  
      if (seqno && chkDigit) {
        try {
          console.log('fetch prev now')
          const fetchedPrevReading = await fetchPrevReading(seqno, chkDigit);
          console.log('fetch done')
  
          // Update row with fetched previous reading
          const updatedRow = {
            ...editedRow,
            prevReading: fetchedPrevReading,
            consumption_qnty:
              presentReading && fetchedPrevReading
                ? Number(presentReading) - Number(fetchedPrevReading)
                : '',
          };
  
          setRows((prevRows) =>
            prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row)),
          );
  
          // Dynamically add a new row if the last row is edited
          if (editedRow.id === rows[rows.length - 1].id) {
            handleAddNewRow();
          }
  
          toast.success('Row successfully updated!');
          return updatedRow;
        } catch (error) {
          toast.error('Failed to fetch previous reading');
          console.error('Error fetching previous reading:', error);
          throw error;
        }
      }
    };
  
    // Function to add a new row
    const handleAddNewRow = () => {
      const newId = rows.length ? Math.max(...rows.map((row) => row.id)) + 1 : 1;
      const newRow = { ...initialBillProcessEntryValues, id: newId };
      setRows((prevRows) => [...prevRows, initialBillProcessEntryValues]);
      setTotalRows((totalRows) => {
        return totalRows + 1;
      });
      //check for last row  in page
      if (rows.length >= paginationModel.pageSize * (paginationModel.page + 1)) {
        handleNextPage();
      }
      // Focus on the new row
      setTimeout(() => {
        apiRef.current.setCellFocus(newId, 'seqno');
      }, 500);
    };
  
    //handle moving to next page
    const handleNextPage = () => {
      setPaginationModel((prevModel) => ({
        ...prevModel,
        page: prevModel.page + 1,
      }));
    };
  
    // Function to handle key pres (left- right)
    const handleCellKeyDown = (
      params: { field: string; id: GridRowId },
      event: { key: string; preventDefault: () => void },
    ) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
  
        const fieldIndex = columns.findIndex((col) => col.field === params.field);
        const nextField = columns[(fieldIndex + 1) % (columns.length - 3)].field;
  
        // Move focus to the next cell
        apiRef.current.setCellFocus(params.id, nextField);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
  
        const fieldIndex = columns.findIndex((col) => col.field === params.field);
        if (fieldIndex == 0) {
          return;
        }
        const nextField = columns[(fieldIndex - 1) % columns.length].field;
  
        // Move focus to the next cell
        apiRef.current.setCellFocus(params.id, nextField);
      }
    };
    function handleSaveRow(id: any) {
      console.log('all the rows : ', rows);
      console.log('Save params with id : ', id);
    }
    function handleDeleteRow(id: any) {
      console.log('Delete params with id : ', id);
    }
  
    function removeAllData() {
      alert('are you sure to remove all data?');
      setRows(() => [initialBillProcessEntryValues]);
    }
  
    const columns: GridColDef[] = [
      { field: 'seqno', headerName: 'Seq No', editable: true, flex: 1 },
      { field: 'chkDigit', headerName: 'Check Digit', editable: true, flex: 1 },
      {
        field: 'presentReading',
        headerName: 'Present Reading',
        editable: true,
        flex: 1,
      },
      {
        field: 'prevReading',
        headerName: 'Previous Reading',
        editable: false,
        flex: 1,
      },
      {
        field: 'consumption_qnty',
        headerName: 'Consumption Quantity',
        editable: false,
        flex: 1,
      },
      {
        field: 'charges',
        headerName: 'Charges',
        type: 'actions',
        width: 100,
        getActions: (params) => [
          <span key={`charge-${params.id}`}>
            <Tooltip title="Charges" placement="top-start">
              <GridActionsCellItem
                icon={<AddchartIcon className="text-blue-800" />}
                label="Charges"
                onClick={() => setModalOpen(true)}
                // showInMenu
              />
            </Tooltip>
          </span>,
        ],
      },
      // {
      //     field: "actions",
      //     headerName: "Actions",
      //     type: "actions",
      //     width: 100,
      //     getActions: (params) => [
      //       <span key={`save-${params.id}`}>
      //         <Tooltip
      //          title='save'
      //          placement="top-start"
      //         >
      //         <GridActionsCellItem
      //           icon={<CheckCircleOutlineSharpIcon className="text-blue-500" />}
      //           label="Save"
      //           onClick={() => handleSaveRow(params.id)}
      //           // showInMenu
      //         />
      //         </Tooltip>
      //       </span>,
      //       <span key={`save-${params.id}`}>
      //         <Tooltip title='delete' placement="top-start">
      //         <GridActionsCellItem
      //           icon={<RemoveCircleOutlineSharpIcon className="text-red-500"/>}
      //           label="Delete"
      //           onClick={() => handleDeleteRow(params.id)}
      //           // showInMenu
      //         />
      //         </Tooltip>
      //       </span>
      //     ],
      //   },
    ];
  
    return (
      <div>
        <div className="flex justify-between p-1">
          <h2 className="font-semibold">Total rows:{totalRows}</h2>
          <Button
            className="h-7 rounded-md bg-red-400"
            variant="contained"
            size="medium"
            onClick={removeAllData}
          >
            Clear
          </Button>
        </div>
        <div style={{ height: 'auto', width: '100%' }}>
          <DataGrid
            sx={{
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#0069db',
                color: '#ffff',
                font: 'bold',
              },
              '& .MuiDataGrid-columnHeader .MuiCheckbox-root.Mui-checked': {
                color: '#ffff',
              },
            }}
            columnHeaderHeight={35}
            rowHeight={30}
            rows={rows}
            columns={columns}
            checkboxSelection
            keepNonExistentRowsSelected //next page call then hold data
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            apiRef={apiRef}
            // getRowId={(row) => row.seqno}
            // processRowUpdate={handleProcessRowUpdate}
            onProcessRowUpdateError={(error) => {
              console.error('Row update error:', error);
              toast.error('An error occurred while updating the row.');
            }}
            // onRowEditStop={(row)=>fetchPrevReading(row.seqno,row.chkDigit)}
            onCellKeyDown={handleCellKeyDown} // Handle keydown events
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={setRowModesModel}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
            pageSizeOptions={[5, 10, 20,100]}
  
            // experimentalFeatures={{ newEditingApi: true }}
          />
        </div>
        <PopUpModal open={modalOpen} title={'Add Charges'} onClose={()=>setModalOpen(false)} >
          <div>
         
          hello world
          </div>
        </PopUpModal>
      </div>
    );
  }
  