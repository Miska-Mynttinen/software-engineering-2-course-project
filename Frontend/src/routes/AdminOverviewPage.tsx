import { Box } from "@mui/material";
import OrganizationSidebar from "../components/OverviewPage/OrganizationSidebar";

export default function AdminPage() {
    return (
        <div>
            <Box sx={{display: 'flex'}}>
                <OrganizationSidebar />
            </Box>
        </div>
    )
}