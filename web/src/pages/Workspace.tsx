import { gql, useQuery } from '@apollo/client';
import { Grid } from '@mui/material';
import { useState } from 'react';
import Focus from '../components/item/FocusedItem';
import ItemList from '../components/item/ItemList';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

type Tag = {
  id: string;
  name: string;
};
export type Item = {
  id: string;
  name: string;
  description?: string;
  tags: Tag[];
};

type GetItemsResponse = {
  getAllItems: Item[];
};
const GET_ITEMS = gql`
  query GetAllItems {
    getAllItems {
      id
      createdAt
      name
    }
  }
`;

const drawerWidth = 240;

interface WorkspaceProps {
  window?: () => Window;
}

export default function Workspace(props: WorkspaceProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { loading, error, data } = useQuery<GetItemsResponse>(GET_ITEMS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const { window } = props;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
        // sx={{
        //   width: { sm: `calc(100% - ${drawerWidth}px)` },
        //   ml: { sm: `${drawerWidth}px` },
        // }}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component='nav'
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label='mailbox folders'
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Grid
          container
          spacing={{ xs: 2, md: 4, lg: 8 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={4} sm={4} md={6}>
            {data && (
              <ItemList
                items={data.getAllItems}
                focusedIndex={focusedIndex}
                setFocusedIndex={setFocusedIndex}
              />
            )}
          </Grid>
          <Grid item xs={4} sm={4} md={6}>
            {data && <Focus item={data?.getAllItems[focusedIndex]} />}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}