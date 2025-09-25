---
layout: single
title: "BioHackathon 2025 Challenge Track 3"
date: "2025-09-25"
categories: event biohackathon track3
category: 'biohackathon2025'
---
## Automatic Curation of Oligogenic Disease Evidence from PDFs

**1\. Abstract**
Oligogenic diseases, caused by combinations of genetic variants across multiple genes, represent a complex and understudied area of human genetics. Critical information about gene–variant–disease relationships remains locked in unstructured scientific publications, limiting large-scale analysis and clinical translation. This challenge invites participants to develop an **automatic curation pipeline** capable of extracting structured knowledge from PDF articles.

Given a set of publications and a defined curation schema, participants must build a system that identifies genes, variants, diseases, and supporting evidence, and outputs them as structured, machine-readable datasets. Solutions will be evaluated for accuracy, completeness, consistency with the schema, and scalability across heterogeneous document formats.

By enabling automated extraction of oligogenic evidence from the literature, this challenge aims to accelerate research, improve data accessibility, and support the development of comprehensive resources for understanding oligogenic diseases.

## **2\. Background and Motivation**

Oligogenic diseases arise from the combined effect of variants in two or more genes. Unlike monogenic disorders, where a single gene explains the phenotype, oligogenic conditions involve **variant interactions** that complicate diagnosis, genetic counseling, and therapeutic decision-making. Mapping these gene–variant combinations is therefore crucial to understanding disease mechanisms and improving patient care.

Despite their importance, most oligogenic findings are scattered across **many scientific publications**, typically locked in PDF format. These publications contain key data — including lists of variants, gene pairs, phenotypic associations, and experimental evidence — but extracting this information manually is **time-consuming, resource-intensive, and error-prone**. As a result, curated resources covering oligogenic diseases remain incomplete, hindering research and limiting the integration of this knowledge into clinical workflows.

Automating this curation process has the potential to:

* **Accelerate knowledge discovery** by systematically mining the biomedical literature.
* **Enable large-scale analyses** of gene–gene interactions and variant combinations.
* **Support clinical decision-making** with more comprehensive datasets.
* **Reduce the burden on human curators**, allowing experts to focus on validation and interpretation rather than repetitive data entry.

This challenge provides a structured framework for developing and benchmarking **automatic curation pipelines** that can extract gene–variant–disease relationships and evidence statements from PDFs at scale. By addressing this task, participants contribute to a critical step toward **open, reusable, and high-quality datasets** for the study of oligogenic diseases.

## **3\. Challenge Objectives**

The goal of this challenge is to design, implement, and benchmark **automatic curation pipelines** that transform unstructured biomedical literature into structured, reusable knowledge on oligogenic diseases.

Specifically, participants are expected to:

1. **Automate Literature Processing**
   * Develop workflows to systematically ingest and parse PDF publications, including text, tables, and supplementary material.
2. **Extract Key Biological Entities**
   * Identify and normalize **genes** (Ensembl gene IDs/HGNC identifiers), **variants** (chrom:pos:ref:alt/HGVS-compliant notation), and **diseases/phenotypes** (e.g., OMIM, Orphanet).
3. **Capture Relationships and Context**
   * Detect **variant combinations** across multiple genes.
   * Link them to **disease associations** and extract **supporting evidence passages** from the source document.
4. **Produce Structured Outputs**
   * Deliver results in the **provided curation schema** (TSV), with clear mappings between extracted information and source references.
5. **Ensure Quality and Scalability**
   * Build pipelines that are accurate, reproduc \- tyracvke, and robust across heterogeneous document formats.
   * Provide documentation so that outputs can be independently verified and reproduced.

## **4\. Data Description**

Participants will receive a **curated set** of scientific publications in PDF format, each focusing on oligogenic diseases. These documents include research articles, case reports, and reviews describing gene–variant–disease relationships.

### **1\. Input Data**

#### a) PDF Corpus

* **Format:** Standard PDF files (mixed layouts, with tables, figures, and text), filename corresponding to PMID.
* **Content:** Publications relevant to oligogenic diseases, curated from peer-reviewed journals and case report repositories.
* **Diversity:** The corpus will include documents with varying complexity (text-only papers, figure-heavy papers, supplementary tables).

#### b) Curation Schema

A schema will be provided to specify the expected output format. Key fields include:

| Field | Description | Example |
| :---: | :---: | :---: |
| PMID | Bibliographic reference (PMID) | PMID:31073086 |
| disease | Standardized disease/phenotype term (OMIM, Orphanet, HPO) | Idiopathic pulmonary fibrosis |
| OMIMIDs | Standardized disease/phenotype ID “;”-separated (OMIM) | 616371;178500;616373 |
| Variants | Variant combination with gene, variants separated by “;”, gene and notations separated by “\|” | 14:23424059:C:T\|MYH7\|c.2770G>A\|p.Glu924Lys; 6:112131011:C:T\|LAMA4\|c.3925G>A\|p.Asp1309Asn |
| Score | Score from 0-3 identifying the evidence for the combination available in the paper | 2 |
| Evidence | Reference or quote to part of pdf where evidence is found | "We identified a digenic combination of GJB2 c.35delG and GJB6 c.269+1G>A in affected siblings." |

Items between brackets are highly encouraged but optional. One pdf may have multiple variant combinations. Ensure your solution extracts all combinations.

## **5\. Baseline and Resources**

We will provide:

* A bash script example that specifies input and output your solution should adhere to.
  * ./run\_curation.sh input.pdf output.tsv

You may use any publicly available packages but must document dependencies.

## **6\. Evaluation Criteria**

### No evaluation metrics are provided, as you are invited to select the most suited one(s). Solutions will be evaluated on

* **Accuracy**: correct identification and normalization of genes, variants, and diseases.
* **Completeness**: coverage of all relevant relationships per document.
* **Evidence Linking**: quality of evidence passages linking variants to disease.
* **Consistency**: adherence to the schema.
* **Scalability**: ability to handle heterogeneous PDF formats.

## **7\. Participation Guidelines**

Your submission must include:

1. Source code and environment specifications. (can be through Github, optional)
2. A runnable script that adheres to the run\_curation.sh format:
   * Accepts one input pdf
   * Runs the solution you devised
   * Outputs results as specified in a .tsv file

External data is permitted if openly available and clearly declared.

During the pitch session, you are asked to provide a 10 mins pitch presentation (followed by 4-mins Q\&A) presenting the way you tackled the challenge, from model choice, evaluation metrics, model performance on dataset and how you met the evaluation criteria mentioned earlier.

[Submission Link](https://forms.gle/QyC9kiFJ4GqwzSK18)

## **8\. Timeline**

* **Submission deadline:** September 26, 16:45 (local time).
* **Submission format:** Single .zip file uploaded to the challenge portal.
* **Late submissions will not be accepted.**

### **Disclaimer**

#### **The PDF documents provided in this challenge are supplied solely for the purpose of developing, testing, and benchmarking automatic curation pipelines for oligogenic disease research.**

#### **Participants must not use, share, or redistribute these papers or their contents for any other purpose.**

#### **All participants are responsible for respecting the copyright and licensing terms of the source publications. Any derived data (e.g., curated outputs) must be attributed appropriately and used in compliance with the challenge guidelines.**

#### **By participating, you agree to use the provided material only for this challenge and to delete any local copies of the PDFs once the challenge is completed.**

####
