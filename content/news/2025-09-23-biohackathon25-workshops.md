---
layout: single
title: "BioHackathon 2025 Workshops Overview"
date: "2025-09-23"
categories: event biohackathon
category: 'biohackathon2025'
excerpt: "An overview of the BioHackathon 2025 workshops, covering differential analysis on graphs, latent representations of single-cell RNA-seq data, and foundation models for genomics."
---

## Workshop 1: Differential Analysis on Graphs

This workshop will focus on applying graph differential analysis to investigate sex-specific differences in lung adenocarcinoma. By comparing regulatory networks, the goal is to uncover molecular mechanisms that differ between biological males and females, potentially providing insights for future therapeutic strategies. Leveraging graph-based representations, as opposed to traditional tabular expression data, allows for the detection of subtle and higher-order regulatory differences that might otherwise remain hidden.

### Data Used

For this demonstration, we will use male and female regulatory networks derived from TCGA LUAD data. These networks were constructed from gene expression profiles stratified by sex using the WGCNA R package.

The networks are available for download at: [https://zenodo.org/records/10558427](https://zenodo.org/records/10558427) in the folder `LUADmf/WGCNA networks`. Each network is approximately 1.5 GB, so please ensure they are downloaded prior to the workshop.

### Analysis Tool

To perform the graph differential analysis, we will utilize `node2vec2rank`. More information can be found in the bioRxiv preprint: [https://www.biorxiv.org/content/10.1101/2024.06.16.599201v1](https://www.biorxiv.org/content/10.1101/2024.06.16.599201v1).

The Python implementation and corresponding notebook are available at:

*   **Implementation:** [https://github.com/pmandros/node2vec2rank/tree/main](https://github.com/pmandros/node2vec2rank/tree/main)
*   **Notebook:** [https://github.com/pmandros/node2vec2rank/blob/main/notebooks/node2vec2rank_workflow_WGCNA_LUAD_mVSf_paper.ipynb](https://github.com/pmandros/node2vec2rank/blob/main/notebooks/node2vec2rank_workflow_WGCNA_LUAD_mVSf_paper.ipynb)

---

## Workshop 2: Exploring Latent Representations of Single-Cell RNA-seq Data

This workshop will begin with a 1-hour keynote and Q&A session. This session will review the current state-of-the-art in representation learning within transcriptomics, covering everything from linear methods to advanced neural network architectures.

In the subsequent 1.5-hour workshop, participants will:

* Explore a public single-cell RNA-seq dataset.
* Evaluate the effectiveness of several state-of-the-art representation learning methods for learning latent representations of single-cell data.

You will be provided with a basic Colab Python notebook containing boilerplate code for data handling and fundamental representation learning algorithms. Your task will be to extend this notebook with a benchmarking framework to identify the strengths and weaknesses of various methods.

The workshop will present several challenges to tackle, including:

* Adding additional representation learning algorithms (optional).
* Designing and implementing unsupervised metrics (e.g., geometric or topological metrics).
* Designing and implementing supervised metrics (e.g., cell type homogeneity metrics).
* Designing and implementing visualization tools.
* Providing usage guidelines for representation learning methods based on specific situations and metrics of interest.

---

## Workshop 3: Foundation Models for Genomics

The human genome sequence provides the underlying code for human biology. Understanding this sequence-code is vital for comprehending how genetic variants affect human disease and traits, a challenge that has long been one of biology's most significant.

With the exponential growth of genomics and biomedical data, deep learning methods have emerged as powerful tools. Their capacity to identify highly complex patterns in large datasets can significantly aid in this endeavor. This workshop will explore whether deep learning models, which have revolutionized fields like image recognition and natural language processing, can also help decode the human genome and advance personalized medicine.

### Workshop Content

This workshop will provide:

* An overview of how deep learning can be used to learn the regulatory code of the genome.
* Discussions on specific deep learning models and their applications.
* Hands-on experience implementing these concepts.

The accompanying talk will introduce key elements and questions in regulatory genomics. It will also present specific deep learning methods and applications relevant to various genomics problems, including:

* CNNs (Convolutional Neural Networks)
* Transformers
* LLMs (Large Language Models)

### Hands-on Session

In the practical session, participants will:

* Train models from scratch.
* Fine-tune foundation models to predict regulatory activities and gene expression from DNA sequences.

This hands-on session will utilize Python.
