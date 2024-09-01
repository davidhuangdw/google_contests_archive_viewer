import React, {useContext} from "react";
import {Outlet} from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    CssBaseline,
    Box,
    Container,
} from '@mui/material';
import {Menu as MenuIcon} from '@mui/icons-material';
import {ProblemContext} from "../contexts/ProblemContext.tsx";

const MainLayout: React.FC = () => {
    const {round} = useContext(ProblemContext);
    return (
        <Container>
            <CssBaseline/>
            <AppBar>
                <Container maxWidth="xl">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}>
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
                            {round}
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box component="main">
                <Toolbar/>
                <Outlet/>
            </Box>
        </Container>
    );
};

export default MainLayout;
