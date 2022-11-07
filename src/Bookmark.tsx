import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { create, insert } from '@lyrasearch/lyra';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    TextField,
    Typography
} from '@mui/material';
import { atom, useAtom } from 'jotai';
import { MouseEvent, useEffect, useState } from 'react';
import goUrl from './goUrl';

interface Bookmark {
    id: string;
    title: string;
    url: string;
}

type DialogType = 'add' | 'edit' | 'delete';

const bookmarkItemsAtomBase = atom<Bookmark[]>(
    (JSON.parse(localStorage.getItem('bookmarkItems') ?? '[]') as Omit<Bookmark, 'id'>[]).map(
        (item) => ({ ...item, id: crypto.randomUUID() })
    )
);
const bookmarkItemsAtom = atom<Bookmark[], Bookmark[]>(
    (get) => get(bookmarkItemsAtomBase),
    (_, set, value) => {
        set(bookmarkItemsAtomBase, value);
        localStorage.setItem(
            'bookmarkItems',
            JSON.stringify(value.map((item) => ({ ...item, id: undefined })))
        );
    }
);

export const bookmarkDB = create({
    schema: {
        title: 'string',
        url: 'string'
    }
});

console.time('insert');
for (const bookmark of JSON.parse(localStorage.getItem('bookmarkItems') ?? '[]') as Omit<
    Bookmark,
    'id'
>[]) {
    insert(bookmarkDB, bookmark);
}
console.timeEnd('insert');

const BookmarkItem = ({
    item,
    dragging,
    onContextMenu
}: {
    item: Bookmark;
    dragging: boolean;
    onContextMenu: (event: MouseEvent) => void;
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: item.id
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Box
                sx={{
                    position: 'relative',
                    width: 86,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: dragging ? 'grabbing' : 'pointer'
                }}
                onClick={() => goUrl(item.url)}
                onMouseUp={(e) => {
                    if (e.button === 1) goUrl(item.url, true);
                }}
                onContextMenu={onContextMenu}
            >
                <img
                    src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${item.url}&sz=64`}
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: 12,
                        filter: `brightness(${dragging ? '60%' : '100%'})`
                    }}
                />
                <Typography
                    component='p'
                    sx={{
                        width: 86,
                        mt: 0.5,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: '#fff'
                    }}
                >
                    {item.title}
                </Typography>
            </Box>
        </div>
    );
};

const BookmarkDialog = ({
    open,
    onClose,
    dialogType,
    id
}: {
    open: boolean;
    onClose: () => void;
    dialogType: DialogType;
    id?: string;
}) => {
    const [bookmarkItems, setBookmarkItems] = useAtom(bookmarkItemsAtom);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    useEffect(() => {
        if (!open) return;
        if (dialogType === 'add') {
            setTitle('');
            setUrl('');
        } else {
            const item = bookmarkItems.find((item) => item.id === id)!;
            setTitle(item.title);
            setUrl(item.url);
        }
    }, [open]);
    const addBookmark = () => {
        setBookmarkItems([
            ...bookmarkItems,
            {
                id: crypto.randomUUID(),
                title,
                url
            }
        ]);
        onClose();
        insert(bookmarkDB, { title, url });
    };
    const editBookmark = () => {
        const newBookmarkItems = [...bookmarkItems];
        const index = newBookmarkItems.findIndex((item) => item.id === id);
        newBookmarkItems[index].title = title;
        newBookmarkItems[index].url = url;
        setBookmarkItems(bookmarkItems);
        onClose();
    };
    const deleteBookmark = () => {
        const newBookmarkItems = [...bookmarkItems];
        const index = newBookmarkItems.findIndex((item) => item.id === id);
        newBookmarkItems.splice(index, 1);
        setBookmarkItems(newBookmarkItems);
        onClose();
    };
    if (dialogType !== 'delete')
        return (
            <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
                <DialogTitle>
                    {
                        {
                            add: 'Add bookmark',
                            edit: 'Edit bookmark'
                        }[dialogType]
                    }
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        variant='standard'
                        label='Title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    ></TextField>
                    <TextField
                        variant='standard'
                        label='URL'
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                if (dialogType === 'add') {
                                    addBookmark();
                                } else {
                                    editBookmark();
                                }
                                e.preventDefault();
                            }
                        }}
                    ></TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={dialogType === 'add' ? addBookmark : editBookmark}>
                        {{ add: 'Add', edit: 'Save' }[dialogType]}
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    return (
        <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
            <DialogTitle>Delete bookmark</DialogTitle>
            <DialogContent>
                <DialogContentText>Delete {title}?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color='error' onClick={deleteBookmark}>
                    Delete
                </Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

const Bookmark = () => {
    const [bookmarkItems, setBookmarkItems] = useAtom(bookmarkItemsAtom);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [isShowDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState<DialogType>('add');
    const [targetId, setTargetId] = useState<string>();
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10
            }
        }),
        useSensor(TouchSensor, { activationConstraint: { distance: 10 } })
    );
    const onDragStart = ({ active }: DragStartEvent) => setDraggingId(active.id as string);
    const onDragEnd = ({ active, over }: DragEndEvent) => {
        setDraggingId(null);
        if (!active || !over || active.id === over.id) return;
        const newItems = [...bookmarkItems];
        const oldIndex = bookmarkItems.findIndex((item) => item.id === (active.id as string));
        const newIndex = bookmarkItems.findIndex((item) => item.id === (over.id as string));
        newItems.splice(newIndex, 0, newItems.splice(oldIndex, 1)[0]);
        setBookmarkItems(newItems);
    };
    const showContextMenu = (event: MouseEvent, targetId: string) => {
        setContextMenu({ x: event.clientX, y: event.clientY });
        setTargetId(targetId);
        event.preventDefault();
    };
    const showDialog = (dialogType: DialogType) => {
        setDialogType(dialogType);
        setShowDialog(true);
    };
    const closeDialog = () => setShowDialog(false);
    return (
        <>
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <SortableContext items={bookmarkItems}>
                    <Box
                        sx={{
                            flexGrow: 6,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'baseline',
                            flexWrap: 'wrap',
                            alignContent: 'flex-start',
                            gap: 3,
                            overflowY: 'auto'
                        }}
                    >
                        {bookmarkItems.map((item) => (
                            <BookmarkItem
                                key={item.id}
                                item={item}
                                dragging={item.id === draggingId}
                                onContextMenu={(event: MouseEvent) =>
                                    showContextMenu(event, item.id)
                                }
                            />
                        ))}
                        <IconButton
                            size='large'
                            onClick={() => showDialog('add')}
                            aria-label='Add Bookmark'
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                </SortableContext>
            </DndContext>
            <BookmarkDialog
                open={isShowDialog}
                onClose={closeDialog}
                dialogType={dialogType}
                id={targetId}
            />
            <Menu
                open={contextMenu !== null}
                onClose={() => setContextMenu(null)}
                anchorReference='anchorPosition'
                anchorPosition={
                    contextMenu !== null
                        ? {
                              left: contextMenu.x,
                              top: contextMenu.y
                          }
                        : undefined
                }
            >
                <MenuItem
                    onClick={() => {
                        showDialog('edit');
                        setContextMenu(null);
                    }}
                >
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        showDialog('delete');
                        setContextMenu(null);
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};
export default Bookmark;
