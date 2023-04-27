import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import RequestTerminal from './RequestTerminal';
import AppTable from 'components/app-table';
import { connect } from 'react-redux';
import {fetchTerminals} from "services/tmsService";

const POSIndex = ( ) => {

    const { t } = useTranslation();

    const [openRequest, setOpenRequest] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [perPage] = React.useState(25);
    const [terminals, setData] = React.useState(null);
    const loadData = () => {
        setLoading(true);
        fetchTerminals().then(res=>{
            setLoading(false);
            if (res.responseCode === '00'){
                setData(res);
            }
        }).catch(e=>{
            setLoading(false);
        })
    }
    useEffect(() => {
        loadData();
    }, []);

    const [columns] = React.useState([
        {
            name: t('Terminal ID'),
            style: { width: '150px' },
            cell: row => (
                <span className="text-right seerbit-color" title={row && row.terminalId && row.terminalId}>
          {row && row.terminalId && row.terminalId}
        </span>
            )
        },
        {
            name: t('Serial No'),
            style: { width: '150px' },
            cell: row => (
                <span className="text-right" title={row && row.serialNo && row.serialNo}>
          {row && row.serialNo && row.serialNo}
        </span>
            )
        },
        {
            name: t('version'),
            style: { width: '150px' },
            cell: row => (
                <span className="text-right" title={row && row.version && row.version}>
          {row && row.version && row.version}
        </span>
            )
        },
        {
            name: t('brand'),
            style: { width: '150px' },
            cell: row => (
                <span className="text-right" title={row && row.brand && row.brand}>
          {row && row.brand && row.brand}
        </span>
            )
        },
        {
            name: t('branchName'),
            style: { width: '150px' },
            cell: row => (
                <span className="text-right" title={row && row.branchName && row.branchName}>
          {row && row.branchName && row.branchName}
        </span>
            )
        },
        {
            name: t('PTSP'),
            style: { width: '150px' },
            cell: row => (
                <span className="text-right" title={row && row.ptsp && row.ptsp}>
          {row && row.ptsp && row.ptsp}
        </span>
            )
        },
        {
            name: t('Status'),
            style: { width: '150px' },
            cell: row => (
                <span className="text-right" title={row && row.status && row.status}>
          {row && row.status && row.status}
        </span>
            )
        },
    ]);

    return (
        <div className="page-container">
            <div className="py-5">
                <div className="font-medium font-20 text-black mr-3 d-none d-lg-block mb-4">
                    {t("Terminals")}
                </div>
                <div>
                    <div className="d-flex justify-content-between">
                        <div>
                            <Button
                                variant="xdh"
                                height={"40px"}
                                className="brand-btn"
                                style={{ width: "200px" }}
                                onClick={() => setOpenRequest(true)}
                            >
                                {t('Request a POS Terminal')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>


                <AppTable
                    columns={columns}
                    headerStyle={{ textTransform: 'uppercase' }}
                    loading={loading}
                    fixedLayout={false}
                    paginate={terminals?.rowCount && Math.ceil(terminals?.rowCount / perPage) > 1 || false}
                    perPage={perPage}
                    totalPages={terminals?.rowCount && Math.ceil(terminals?.rowCount / perPage) || 0}
                    // changePage={(page) => changePage(page.activePage - 1)}
                    currentPage={terminals?.rowCount && parseInt(terminals?.rowCount) === 0 ?
                        1 : parseInt(terminals?.currentPage) === perPage ?
                            2 : Math.ceil(parseInt(terminals?.currentPage) / perPage) + 1
                    }
                    data={terminals?.payload || []}
                    rowStyle={{ cursor: 'pointer' }}
                />


            <RequestTerminal isOpen={openRequest} close={() => setOpenRequest(false)} refresh={loadData}/>
        </div>
    );
}

const mapStateToProps = (state) => ({
    terminals: state.posTerminals.terminals,
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(POSIndex);
