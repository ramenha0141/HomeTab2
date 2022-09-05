import { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Tab } from '@mui/material';
import { atom, useAtom } from 'jotai';
import { FormatListBulleted } from '@mui/icons-material';

interface Task {
    type: string;
    title: string;
    detail: string;
}

const tasksAtomBase = atom<Task[]>(JSON.parse(localStorage.getItem('tasks') ?? '[]') as Task[]);
const tasksAtom = atom<Task[], Task[]>(
    (get) => get(tasksAtomBase),
    (_, set, value) => {
        set(tasksAtomBase, value);
        localStorage.setItem('tasks', JSON.stringify(value));
    }
);

const Tasks = () => {
    const [tasks, setTasks] = useAtom(tasksAtom);
    const [tabIndex, setTabIndex] = useState('1');
    return (
        <TabContext value={tabIndex}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={(_, tabIndex) => setTabIndex(tabIndex)}>
                    <Tab label='Todo' value='1' />
                    <Tab label='Finished' value='2' />
                    <Tab label='Trash' value='3' />
                </TabList>
            </Box>
            <TabPanel value='1'>
                <List>
                    {tasks.map((task) => (
                        <ListItem>
                            <ListItemAvatar>
                                <FormatListBulleted />
                            </ListItemAvatar>
                            <ListItemText primary={task.title} secondary={task.detail} />
                        </ListItem>
                    ))}
                </List>
            </TabPanel>
            <TabPanel value='2'></TabPanel>
            <TabPanel value='3'></TabPanel>
        </TabContext>
    );
};
export default Tasks;
