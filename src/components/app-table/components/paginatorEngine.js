import React from 'react';
import { Grid, Icon, Pagination } from 'semantic-ui-react';
import {useTranslation} from "react-i18next";

const PaginatorEngine = (props) =>{
    const quantities = [
        { key: 1, text: '5', value: 5 },
        { key: 2, text: '10', value: 10 },
        { key: 3, text: '25', value: 25 },
        { key: 3, text: '50', value: 50 },
        { key: 3, text: '100', value: 100 },
        { key: 3, text: '150', value: 150 },
        { key: 3, text: '200', value: 200 },
    ];
    const {t} = useTranslation()
    const changePageFromPerPage = (evt)=>{
        props.changePageFromPerPage(1,evt.currentTarget.selectedOptions[ 0 ].value)
    }
// console.log(props)
    return(
        <div className="perpage py-5">
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 8 }>
                        {/*{props.dontShowPerPage ?*/}
                        {/*    null*/}
                        {/*    :*/}
                        {/*    <div className="font-11 black font-light pl-4">*/}
                        {/*        per page{' '}*/}
                        {/*        <select onChange={ (evt, item) => changePageFromPerPage(evt, item) }>*/}
                        {/*            {quantities.map((item, i) => {*/}
                        {/*                return <option*/}
                        {/*                    key={ i }*/}
                        {/*                    selected={ item.value == props.perPage }*/}
                        {/*                >{item.text}</option>*/}
                        {/*            })}*/}
                        {/*        </select>*/}
                        {/*    </div>*/}
                        {/*}*/}
                    </Grid.Column>
                    <Grid.Column width={ 8 }>
                        <div className={ 'float-right' }>
                            <Pagination
                                as="span"
                                activePage={ props.currentPage }
                                disabled={ props.disabled }
                                pointing
                                secondary
                                totalPages={ props.totalPages }
                                ellipsisItem={ {
                                    content: <Icon name="ellipsis horizontal" />,
                                    icon: true,
                                } }
                                firstItem={ {
                                    content: <Icon name="angle left" />,
                                    icon: true,
                                } }
                                lastItem={ {
                                    content: <Icon name="angle right" />,
                                    icon: true,
                                } }
                                prevItem={ { content: t('prev') } }
                                nextItem={ { content: t('next') } }
                                onPageChange={ (s,u)=>props.changePage(u) }
                            />
                        </div>{' '}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    )
}

export default PaginatorEngine;
