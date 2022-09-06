import { useEffect, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    Tab,
    TextField
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Done as DoneIcon,
    FormatListBulleted as FormatListBulletedIcon
} from '@mui/icons-material';
import createLocalStorageAtom from './createLocalStorageAtom';
import { useAtom } from 'jotai';

interface Task {
    title: string;
    detail: string;
    finishedDate?: string;
}

const todoAtom = createLocalStorageAtom<Task[]>('task_todo', []);
const finishedAtom = createLocalStorageAtom<Task[]>('task_finished', []);

const NewTaskDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const [todo, setTodo] = useAtom(todoAtom);
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');
    useEffect(() => {
        if (!open) return;
        setTitle('');
        setDetail('');
    }, [open]);
    const add = () => {
        setTodo([
            ...todo,
            {
                title,
                detail
            }
        ]);
        onClose();
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    variant='standard'
                    label='Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    variant='standard'
                    label='Detail'
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={add}>Add</Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

const Tasks = () => {
    const [todo, setTodo] = useAtom(todoAtom);
    const [finished, setFinished] = useAtom(finishedAtom);
    const [tabIndex, setTabIndex] = useState('1');
    const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
    const finishTodo = (index: number) => {
        const newTodo = [...todo];
        setFinished([
            ...finished,
            { ...newTodo.splice(index, 1)[0], finishedDate: new Date().toDateString() }
        ]);
        setTodo(newTodo);
    };
    const removeTodo = (index: number) => {
        const newTodo = [...todo];
        newTodo.splice(index, 1);
        setTodo(newTodo);
    };
    const removeFinished = (index: number) => {
        const newFinished = [...finished];
        newFinished.splice(index, 1);
        setFinished(newFinished);
    };
    return (
        <TabContext value={tabIndex}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList centered onChange={(_, tabIndex) => setTabIndex(tabIndex)}>
                    <Tab icon={<FormatListBulletedIcon />} label='Todo' value='1' />
                    <Tab icon={<DoneIcon />} label='Finished' value='2' />
                </TabList>
            </Box>
            <TabPanel value='1'>
                <List dense>
                    {todo.map((task, i) => (
                        <ListItem key={i} disablePadding>
                            <ListItemButton>
                                <ListItemAvatar>
                                    <FormatListBulletedIcon />
                                </ListItemAvatar>
                                <ListItemText primary={task.title} secondary={task.detail} />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => finishTodo(i)}>
                                        <DoneIcon />
                                    </IconButton>
                                    <IconButton onClick={() => removeTodo(i)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Button variant='contained' onClick={() => setShowNewTaskDialog(true)}>
                        New Task
                    </Button>
                </Box>
                <NewTaskDialog
                    open={showNewTaskDialog}
                    onClose={() => setShowNewTaskDialog(false)}
                />
            </TabPanel>
            <TabPanel value='2'>
                <List dense>
                    {finished.map((task, i) => (
                        <ListItem key={i}>
                            <ListItemButton>
                                <ListItemAvatar>
                                    <DoneIcon />
                                </ListItemAvatar>
                                <ListItemText primary={task.title} secondary={task.detail} />
                                <ListItemSecondaryAction>
                                    {task.finishedDate}
                                    <IconButton onClick={() => removeFinished(i)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </TabPanel>
        </TabContext>
    );
};
export default Tasks;
