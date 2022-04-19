import React, {useState, useEffect, useRef, Fragment} from 'react';
import Utils from '../modules/Utils.js';
import * as constants from "../modules/Constants.js"
import * as d3 from 'd3';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import PatientScatterPlotD3 from './PatientScatterPlotD3.js';
import DoseEffectViewD3 from './DoseEffectViewD3.js';
import SymptomPlotD3 from './SymptomPlotD3.js';
import Spinner from 'react-bootstrap/Spinner';


export default function OverView(props){
    const ref = useRef(null)

   
    const [scatterVizComponents,setScatterVizComponents] = useState(
        <Spinner 
            as="span" 
            animation = "border"
            role='status'
            className={'spinner'}/>
    )

    const [effectVizComponents,setEffectVizComponents] = useState(
        <Spinner 
            as="span" 
            animation = "border"
            role='status'
            className={'spinner'}/>
    )

    const [symptomVizComponents, setSymptomVizComponents] = useState(
        <Spinner 
            as="span" 
            animation = "border"
            role='status'
            className={'spinner'}/>
    )

    const [metricVizComponents, setMetricVizComponents] = useState(
        <Spinner 
            as="span" 
            animation = "border"
            role='status'
            className={'spinner'}/>
    )

    const [viewToggle,setViewToggle] = useState('symptom')

    const [xVar,setXVar] = useState('dose_pca1');
    const [yVar, setYVar] = useState('dose_pca2');
    const [sizeVar, setSizeVar] = useState('drymouth');


    const symptoms = ['drymouth','voice','teeth','taste','nausea','choke','vomit','pain','mucus','mucositis'];
    //for x and y in the scatterplot
    const varOptions = [
        'dose_pca1','dose_pca2','dose_pca3',
        'symptom_all_pca1','symptom_all_pca2','symptom_all_pca3',
        'symptom_post_pca1','symptom_post_pca2','symptom_post_pca3',
        'symptom_treatment_pca1','symptom_treatment_pca2','symptom_treatment_pca3',
        'totalDose','tstage','nstage',
    ].concat(symptoms);
    //for shape stuff
    const shapeOptions = [
        'tstage','nstage',
    ].concat(symptoms)
    
    function makeDropdown(title,active,onclickFunc,key,options){
        if(options === undefined){
            options = varOptions;
        }
        let buttonOptions = options.map((d,i)=>{
            return (
                <Dropdown.Item
                    key={i+key}
                    value={d}
                    eventKey={d}
                    onClick={() => onclickFunc(d)}
                >{d}</Dropdown.Item>
            )
        })
        return (
            <DropdownButton
             className={'controlDropdownButton'}
             title={title + ': ' + active}
             value={active}
             key={key}
             variant={'primary'}
            >{buttonOptions}</DropdownButton>
        )
    }

    useEffect(function drawCohort(){
        if(props.clusterData != undefined & props.doseData != undefined){
            let newScatterComponent = (
                <Container className={'noGutter fillSpace'}>
                    <PatientScatterPlotD3
                        doseData={props.doseData}
                        clusterData={props.clusterData}
                        selectedPatientId={props.selectedPatientId}
                        setSelectedPatientId={props.setSelectedPatientId}
                        plotVar={props.plotVar}
                        clusterOrgans={props.clusterOrgans}
                        activeCluster={props.activeCluster}
                        setActiveCluster={props.setActiveCluster}
                        xVar={xVar}
                        yVar={yVar}
                        sizeVar={sizeVar}
                        categoricalColors={props.categoricalColors}
                    ></PatientScatterPlotD3>
                </Container>
            )
            let newSymptomComponent = (
                <Container className={'noGutter fillSpace'}>
                    <SymptomPlotD3
                        doseData={props.doseData}
                        clusterData={props.clusterData}
                        selectedPatientId={props.selectedPatientId}
                        setSelectedPatientId={props.setSelectedPatientId}
                        plotVar={props.plotVar}
                        clusterOrgans={props.clusterOrgans}
                        activeCluster={props.activeCluster}
                        setActiveCluster={props.setActiveCluster}
                        xVar={xVar}
                        yVar={yVar}
                        mainSymptom={props.mainSymptom}
                        sizeVar={sizeVar}
                        categoricalColors={props.categoricalColors}
                    ></SymptomPlotD3>
                </Container>
            )
            setScatterVizComponents(newScatterComponent);
            setSymptomVizComponents(newSymptomComponent);
        }else{
            let spinner = (<Spinner 
                as="span" 
                animation = "border"
                role='status'
                className={'spinner'}/>
            );
            setScatterVizComponents(spinner);
            setSymptomVizComponents(spinner);
        }
    },[props.clusterData,props.doseData,
        props.activeCluster,
        props.selectedPatientId,
        props.categoricalColors,
        xVar,yVar,sizeVar]);

    useEffect(function drawEffect(){
        if(props.clusterData != undefined & props.additiveClusterResults != undefined){
            let newComponent = (
                <Container className={'noGutter fillSpace'}>
                    <DoseEffectViewD3
                        doseData={props.doseData}
                        clusterData={props.clusterData}
                        effectData={props.additiveClusterResults}
                        clusterOrgans={props.clusterOrgans}
                        activeCluster={props.activeCluster}
                        symptomsOfInterest={props.symptomsOfInterest}
                        mainSymptom={props.mainSymptom}
                        svgPaths={props.svgPaths}
                    ></DoseEffectViewD3>
                </Container>
            )
            setEffectVizComponents(newComponent)
        }else{
            setEffectVizComponents(
                <Spinner 
                    as="span" 
                    animation = "border"
                    role='status'
                    className={'spinner'}/>
            )
        }
    },[props.clusterData,
        props.svgPaths,
        props.mainSymptom,
        props.additiveClusterResults,
        props.symptomsOfInterest,
        props.clusterOrgans,
        props.activeCluster]);

    function switchView(view){
        console.log('switchview',view)
        if(view == 'scatterplot'){
            return (
                <Row key={view} md={12} className={'noGutter fillSpace'}>
                <Col md={9} className={'noGutter'}>
                    {scatterVizComponents}
                </Col>
                <Col  md={3} style={{'marginTop':'2em'}} className={'noGutter fillHeight'}>
                        {makeDropdown('x-axis',xVar,setXVar,1,varOptions)}
                        {makeDropdown('y-axis',yVar,setYVar,2,varOptions)}
                        {makeDropdown('shape',sizeVar,setSizeVar,3,shapeOptions)}
                </Col>
                </Row>
            )
        } 
        if(view == 'effect'){
            return (
                <Row key={view} md={12} className={'noGutter fillSpace'}>
                    {effectVizComponents}
                </Row>
            )
        } 
        if(view == 'symptom'){
            return (
                <Row key={view} md={12} className={'noGutter fillSpace'}>
                    {symptomVizComponents}
                </Row>
            )
        } 
        if(view == 'metric'){
            return (
                <Row key={view} md={12} className={'noGutter fillSpace'}>
                    {metricVizComponents}
                </Row>
            )
        }
        return (<Spinner 
            as="span" 
            animation = "border"
            role='status'
            className={'spinner'}/>)
    }

    function makeToggleButton(value){
        let active = value === viewToggle;
        let variant = active? 'dark':'outline-secondary';
        let onclick = (e) => setViewToggle(value);
        return (
            <Button
                title={value}
                value={value}
                style={{'width':'auto'}}
                variant={variant}
                disabled={active}
                onClick={onclick}
            >{value}</Button>
        )
    }

    function makeSymptomDropdown(view){
        //there was an if statement before idk
        return makeDropdown(props.mainSymptom,true,props.setMainSymptom,10,props.symptomsOfInterest)
    }

    return ( 
        <div ref={ref} id={'doseClusterContainer'}>
            <Row md={12} style={{'height': '2.5em'}} className={'noGutter fillWidth'}>
                <Col md={6} className={'noGutter'}>
                    {makeToggleButton('scatterplot')}
                    {makeToggleButton('effect')}
                    {makeToggleButton('symptom')}
                    {makeToggleButton('metric')}
                </Col>
                <Col md={6}>
                    {makeSymptomDropdown(viewToggle)}
                </Col>
            </Row>
            <Row md={12} style={{'height': 'calc(100% - 2em)','width':'90%'}}>
            {switchView(viewToggle)}
            </Row>
        </div> 
        )
}
