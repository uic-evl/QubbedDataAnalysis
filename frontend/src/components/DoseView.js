import React, {useState, useEffect, useRef, Fragment} from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Dose2dCenterViewD3 from './Dose2dCenterViewD3.js';
import DoseLegendD3 from './DoseLegendD3.js';
import * as constants from "../modules/Constants.js"

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Spinner from 'react-bootstrap/Spinner';


export default function DoseView(props){
    const ref = useRef(null)

    const plotVarOptions = constants.DVH_KEYS.slice();

    const [clusterVizComponents,setClusterVizComponents] = useState(
        <Spinner 
            as="span" 
            animation = "border"
            role='status'
            className={'spinner'}/>
    )

    function handleChangePlotVar(d,e){
        if(props.plotVar !== d){
            props.setPlotVar(d);
        }
    }

    function plotVarDropDown(){
        let pVarOptions = plotVarOptions.map((d,i)=>{
            return (
                <Dropdown.Item
                    key={i}
                    value={d}
                    eventKey={d}
                    onClick={(e)=>handleChangePlotVar(d,e)}
                >{d}</Dropdown.Item>
            )
        })
        return (
            <DropdownButton
                className={'controlDropdownButton'}
                value={props.plotVar}
                title={''+props.plotVar}
            >{pVarOptions}</DropdownButton>
        )
    }

    useEffect(function drawClusters(){
        if(props.clusterData != undefined & props.svgPaths != undefined){
            //the plot var in a key makes it redraw the whole thing or the plot transforms is messed up
            //if I fix that later I should remove that in the key
            const isClusterActive = (d) => parseInt(d.clusterId) === parseInt(props.activeCluster);
            var sortedClusters = [...props.clusterData]
            sortedClusters.sort((a,b) => {
                if(isClusterActive(a)){ return -1; }
                if(isClusterActive(b)){ return 1; }
                return parseInt(a.clusterId) - parseInt(b.clusterId)
            })
            console.log(sortedClusters.map(d=>d.clusterId))
            let newComponents = sortedClusters.map((d,i) => 
            {
                // let topmargin = '3em';// (i == 0)? '1em': '2em';
                let clusterText = 'Cluster: ' + d.clusterId + ' (n=' + d.cluster_size + ')';
                let onTitleClick = (e) => props.setActiveCluster(parseInt(d.clusterId));
                let clickableTitle = (parseInt(props.activeCluster) !== parseInt(d.clusterId));
                let variant = clickableTitle? 'outline-secondary': 'dark';
                let dotColor = props.categoricalColors(parseInt(d.clusterId));
                return (
                        <Row 
                            className={'clusterPlotCol'} 
                            md={6} 
                            key={i+'doses'+props.plotVar+props.showContralateral}
                        >
                            <Col md={12}
                                style={{'height': '2em!important'}}
                                className={'controlPanelTitle'}
                            >
                                <Button
                                    title={clusterText}
                                    value={d}
                                    onClick={onTitleClick}
                                    variant={variant}
                                    disabled={!clickableTitle}
                                >
                                    {clusterText}
                                    <span r={10} style={{'borderRadius':'70%','color':dotColor}}>{'⬤'}</span>
                                </Button>
                            </Col>
                            <Col md={12}
                                className={'clusterDoseContainer shadow'}
                            >
                                <Dose2dCenterViewD3
                                    data={d}
                                    clusterOrgans={props.clusterOrgans}
                                    plotVar={props.plotVar}
                                    svgPaths={props.svgPaths}
                                    orient={'both'}
                                    addOrganToCue={props.addOrganToCue.bind(this)}
                                    clusterOrganCue={props.clusterOrganCue}
                                    setClusterOrganCue={props.setClusterOrganCue}
                                    showContralateral={props.showContralateral}
                                    showOrganLabels={props.showOrganLabels}
                                    doseColor={props.doseColor}
                                    maxDose={props.maxDose}
                                    setMaxDose={props.setMaxDose}
                                ></Dose2dCenterViewD3>
                            </Col>
                            
                        </Row>
                )
            })
            setClusterVizComponents(newComponents)
        } else{
            let newComponents = []
            for(let i = 0; i < props.nDoseClusters; i++){
                newComponents.push(
                    <Container  fluid={'true'} md={12} className={'noGutter inline fillSpace'} flex={'true'} key={i}>
                        <Spinner 
                            as="span" 
                            animation = "border"
                            role='status'
                            className={'spinner'}
                        />
                    </Container >
                )
            }
            setClusterVizComponents(newComponents)
        }
    },[props.clusterData,props.mainSymptom,
        props.svgPaths,props.clusterOrganCue,
        props.plotVar,props.activeCluster,
        props.showOrganLabels,
        props.symptomsOfInterest,
        props.showContralateral,
    ])

    return ( 
        <div ref={ref} className={'fillSpace overviewContainer'}
            style={{'margin':'1em'}} 
        >
            <Row md={12} className={"centerText viewTitle"}>
                <span>
                    {'Dose (Gy) Of '}
                    {plotVarDropDown()}
                    {' to Each Organ Within Each Cluster'}
                </span>
            </Row>
            <Row md={12} className={'scroll'} style={{'height':'calc(100% - 6em)'}}>
                {clusterVizComponents}
            </Row>
            <Row md={12} style={{'height':'4em','width':'100%'}}>
                <DoseLegendD3
                    plotVar={props.plotVar}
                    doseColor={props.doseColor}
                    maxDose={props.maxDose}
                    vertical={false}
                />
            </Row>
        </div> 
        )
}

//<Col md={2} 
//     style={{'justifyContent':'center'}} 
//     fluid={true} className={'noGutter fillHeight'}
// >
//     <Row style={{'maxHeight': '8em','minHeight':'5em'}} 
//         className={'fillSpace noGutter'}
//     >
//         <span className={'controlPanelTitle'} >{'Dose (Gy)'}</span>
//         <DoseLegendD3
//             plotVar={props.plotVar}
//             doseColor={props.doseColor}
//             maxDose={props.maxDose}
//         />
//     </Row>
    
// </Col>